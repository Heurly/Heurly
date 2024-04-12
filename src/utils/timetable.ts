import { getTimetableData } from "@/server/timetable";
import { TEventTimetable } from "@/types/timetable";
import FullCalendar from "@fullcalendar/react";
import {
    addDays,
    endOfWeek,
    format,
    parseISO,
    startOfWeek,
    subDays,
} from "date-fns";
import { RefObject } from "react";

const SMALL_EVENT_THRESHOLD = 1.5 * 60 * 60 * 1000;
const DATE_KEY_FORMAT = "yyyy-MM-dd";

export const shouldReload: (
    events: Map<string, TEventTimetable[]>,
    dateFrom: Date,
    dateTo: Date,
) => { reload: boolean; min: Date; max: Date } = (events, dateFrom, dateTo) => {
    let max = dateFrom.getTime();
    let min = dateTo.getTime();
    let reload = false;
    let d = dateFrom;

    const dateToTime = dateTo.getTime();
    let dTime = d.getTime();
    for (; dTime < dateToTime; d = addDays(d, 1)) {
        dTime = d.getTime();
        if (!events.has(format(d, DATE_KEY_FORMAT))) {
            if (dTime < min) {
                min = dTime;
                reload = true;
            }
            if (dTime > max) {
                max = dTime;
                reload = true;
            }
        }
    }

    return { reload: reload, min: new Date(min), max: new Date(max) };
};

export const reloadData = async (
    events: Map<string, TEventTimetable[]>,
    setEvents: (e: Map<string, TEventTimetable[]>) => void,
    setCalendarEvents: (e: TEventTimetable[]) => void,
    dateFrom: Date,
    dateTo: Date,
    userId?: string,
) => {
    if (!userId) return;

    const reloadContext = shouldReload(events, dateFrom, dateTo);
    if (!reloadContext.reload) return;

    const ical = await getTimetableData(
        reloadContext.min.getTime(),
        reloadContext.max.getTime(),
        userId,
    );
    if (ical?.VCALENDAR === undefined) return;

    const newEvents = new Map<string, TEventTimetable[]>();
    ical?.VCALENDAR[0]?.VEVENT?.map((e) => {
        const start = parseISO(e.DTSTART);
        const end = parseISO(e.DTEND);
        const small = end.getTime() - start.getTime() < SMALL_EVENT_THRESHOLD;

        const key = format(parseISO(e.DTSTART), DATE_KEY_FORMAT);
        const known = newEvents.get(key);
        const newEntry = {
            code: e.CODE,
            name: e.NAME,
            title: e.SUMMARY,
            start: e.DTSTART,
            end: e.DTEND,
            room: e.LOCATION,
            description: e.DESCRIPTION,
            small: small,
            type: e.TYPE,
            courseId: e.COURSE_ID,
        };
        known?.push(newEntry);

        newEvents.set(key, known ?? [newEntry]);
    });

    const completed = events;

    for (
        let d = reloadContext.min;
        d.getTime() <= reloadContext.max.getTime();
        d = addDays(d, 1)
    ) {
        const key = format(d, DATE_KEY_FORMAT);
        if (newEvents?.has(key)) {
            completed.set(key, newEvents.get(key) ?? []);
        } else if (events?.has(key)) {
            completed.set(key, events?.get(key) ?? []);
        } else {
            completed.set(key, []);
        }
    }

    let newCalendarEvents: TEventTimetable[] = [];
    Array.from(events?.values() ?? [])?.forEach((e) => {
        newCalendarEvents = newCalendarEvents.concat(e);
    });

    setEvents(completed ?? []);
    setCalendarEvents(newCalendarEvents);
};

export const handleDateChange = async (
    calendarRef: RefObject<FullCalendar>,
    date: Date,
    events: Map<string, TEventTimetable[]>,
    setEvents: (e: Map<string, TEventTimetable[]>) => void,
    setCalendarEvents: (e: TEventTimetable[]) => void,
    setLoading: (v: boolean) => void,
    userId?: string,
) => {
    setLoading(true);
    const from = subDays(startOfWeek(date, { weekStartsOn: 1 }), 7);
    const to = addDays(endOfWeek(date, { weekStartsOn: 1 }), 7);

    await reloadData(events, setEvents, setCalendarEvents, from, to, userId);
    const newDate = date.toISOString().slice(0, 10);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(newDate);
    setLoading(false);
};
