"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, LoaderCircle } from "lucide-react";
import iCalendarPlugin from "@fullcalendar/icalendar";
import {
    goToNextPeriod,
    goToPreviousPeriod,
    updatePeriodDisplay,
} from "@/utils/fullCalendarHelper";
import { TEventTimetable, TView } from "@/types/timetable";
import EventContent from "@/components/timetable/event-content";
import { getTimetableData } from "@/server/timetable";
import {
    addDays,
    endOfWeek,
    format,
    parseISO,
    startOfWeek,
    subDays,
} from "date-fns";
import type { User } from "@prisma/client";
import { useDebouncedCallback } from "use-debounce";
import { DatesSetArg } from "@fullcalendar/core/index.js";

const SMALL_EVENT_THRESHOLD = 1.5 * 60 * 60 * 1000;
const DATE_KEY_FORMAT = "yyyy-MM-dd";
const nbPxPhone = 768;
const startTime = "08:00:00";
const endTime = "20:00:00";

export default function Timetable({ userId }: { userId: User["id"] }) {
    const calendarRef = useRef<FullCalendar>(null);
    const [periodDisplay, setPeriodDisplay] = useState<string>("");
    const [events, setEvents] = useState<Map<string, TEventTimetable[]>>(
        new Map(),
    );
    const [loading, setLoading] = useState<boolean>(true);
    // Apparently, Fullcalendar doesn't update the display if we put the map events directly to the component.
    const [calendarEvents, setCalendarEvents] = useState<TEventTimetable[]>([]);

    const shouldReload: (
        dateFrom: Date,
        dateTo: Date,
    ) => { reload: boolean; min: Date; max: Date } = (
        dateFrom: Date,
        dateTo: Date,
    ) => {
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

    const reloadData = async (dateFrom: Date, dateTo: Date) => {
        if (!userId) return;

        const reloadContext = shouldReload(dateFrom, dateTo);
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
            const small =
                end.getTime() - start.getTime() < SMALL_EVENT_THRESHOLD;

            const key = format(parseISO(e.DTSTART), DATE_KEY_FORMAT);
            const known = newEvents.get(key);
            const newEntry = {
                title: e.SUMMARY,
                start: e.DTSTART,
                end: e.DTEND,
                room: e.LOCATION,
                description: e.DESCRIPTION,
                small: small,
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

    const handleDateChange = async (date: Date) => {
        setLoading(true);
        const from = subDays(startOfWeek(date, { weekStartsOn: 1 }), 7);
        const to = addDays(endOfWeek(date, { weekStartsOn: 1 }), 7);

        await reloadData(from, to);
        const newDate = date.toISOString().slice(0, 10);
        if (calendarRef.current) calendarRef.current.getApi().gotoDate(newDate);
        setLoading(false);
    };

    useEffect(() => {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth < nbPxPhone;
            if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.changeView(
                    isMobile ? TView.timeGridDay : TView.timeGridWeek,
                );
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    const refeshCallback = useDebouncedCallback(async (arg: DatesSetArg) => {
        setLoading(true);
        await reloadData(arg.start, arg.end);
        setLoading(false);
    }, 1000);

    return (
        <Card className="h-full py-2 md:flex md:h-full md:flex-col md:p-10">
            <CardHeader className="h-1/6">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <div className="flex flex-col-reverse items-center justify-center gap-5 md:flex-row">
                        <DatePicker
                            onChange={handleDateChange}
                            className="hidden md:flex"
                        />
                        <Button
                            className="hidden bg-sky-50 text-black md:block"
                            onClick={() => handleDateChange(new Date())}
                            data-cy="todayBtn"
                        >
                            Aujourd&apos;hui
                        </Button>
                    </div>
                    {loading && <LoaderCircle className="ml-6 animate-spin" />}
                    <div className="flex w-full items-center justify-center gap-x-5 md:justify-end">
                        <Button
                            className="aspect-square rounded-full bg-sky-50 p-3 md:order-2"
                            onClick={() => goToPreviousPeriod(calendarRef)}
                            data-cy="previousPeriodBtn"
                        >
                            <ArrowLeft
                                className=" h-9 w-9 text-black"
                                size={60}
                            />
                        </Button>
                        <p
                            data-cy="periodDisplay"
                            className="hidden md:order-1 md:block"
                        >
                            {periodDisplay}
                        </p>
                        <DatePicker
                            onChange={handleDateChange}
                            className="md:hidden"
                        />
                        <Button
                            className="aspect-square rounded-full bg-sky-50 p-3 md:order-3"
                            onClick={() => goToNextPeriod(calendarRef)}
                            data-cy="nextPeriodBtn"
                        >
                            <ArrowRight className="text-black" size={60} />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="h-5/6 overflow-scroll">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin]}
                    initialView={TView.timeGridWeek}
                    headerToolbar={false}
                    events={calendarEvents}
                    eventContent={EventContent}
                    locale={frLocale}
                    weekends={true}
                    allDaySlot={false}
                    slotMinTime={startTime}
                    slotMaxTime={endTime}
                    height={"100%"}
                    // contentHeight="1rem"
                    // aspectRatio={1.5}
                    nowIndicator={true}
                    datesSet={async (arg) => {
                        setPeriodDisplay(updatePeriodDisplay(arg));
                        void (await refeshCallback(arg));
                    }}
                />
            </CardContent>
        </Card>
    );
}
