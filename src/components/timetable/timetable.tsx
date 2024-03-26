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
import { addDays, endOfWeek, format, parseISO, startOfWeek } from "date-fns";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";
import { DatesSetArg } from "@fullcalendar/core/index.js";

const SMALL_EVENT_THRESHOLD = 1.5 * 60 * 60 * 1000;
const DATE_KEY_FORMAT = "yyyy-MM-dd";

export default function Timetable({ userId }: { userId: User["id"] }) {
    const session = useSession();
    const calendarRef = useRef<FullCalendar>(null);
    const [periodDisplay, setPeriodDisplay] = useState<string>("");
    const [events, setEvents] = useState<Map<string, TEventTimetable[]>>(
        new Map(),
    );
    const nbPxPhone = 768;
    const startTime = "08:00:00";
    const endTime = "20:00:00";

    const shouldReload: (
        dateFrom: Date,
        dateTo: Date,
    ) => { reload: boolean; min: Date; max: Date } = (
        dateFrom: Date,
        dateTo: Date,
    ) => {
        let max: Date = dateFrom;
        let min: Date = dateTo;
        let reload = false;
        let d = dateFrom;
        d.setHours(0, 0, 0, 0);

        for (; d.getTime() < dateTo.getTime(); d = addDays(d, 1)) {
            if (!events.has(format(d, DATE_KEY_FORMAT))) {
                if (d.getTime() < min.getTime()) {
                    min = d;
                    reload = true;
                }
                if (d.getTime() > max.getTime()) {
                    max = d;
                    reload = true;
                }
            }
        }

        return { reload: reload, min: min, max: max };
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
            known?.push({
                title: e.SUMMARY,
                start: e.DTSTART,
                end: e.DTEND,
                room: e.LOCATION,
                description: e.DESCRIPTION,
                small: small,
            });

            newEvents.set(key, known ?? []);
        });

        const completed = events;

        for (
            let d = reloadContext.min;
            d.getTime() < reloadContext.max.getTime();
            d = addDays(d, 1)
        ) {
            const key = format(d, DATE_KEY_FORMAT);
            if (newEvents.has(key)) {
                completed.set(key, newEvents?.get(key) ?? []);
            } else if (events.has(key)) {
                completed.set(key, events?.get(key) ?? []);
            } else {
                completed.set(key, []);
            }
        }

        setEvents(completed ?? []);
    };

    const handleDateChange = async (date: Date) => {
        const from = addDays(startOfWeek(date), 1);
        const to = addDays(endOfWeek(date), 1);

        await reloadData(from, to);
        const newDate = addDays(date, 1).toISOString().slice(0, 10);
        if (calendarRef.current) calendarRef.current.getApi().gotoDate(newDate);
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
        await reloadData(arg.start, arg.end);
    }, 1000);

    const getEventValues = useCallback(
        (events: Map<string, TEventTimetable[]>) => {
            let res: TEventTimetable[] = [];

            console.log(Array.from(events?.values() ?? []));
            Array.from(events?.values() ?? [])?.forEach((e) => {
                res = res.concat(e);
            });

            return res;
        },
        [],
    );

    return (
        <Card className="h-[100svh] py-2 md:flex md:h-full md:flex-col md:p-10">
            <CardHeader>
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
                    <div className="flex w-full items-center justify-center gap-x-5 md:justify-end">
                        {!session.data && (
                            <LoaderCircle className="animate-spin" />
                        )}
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

            <CardContent className="h-full overflow-auto">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin]}
                    initialView={TView.timeGridWeek}
                    headerToolbar={false}
                    events={getEventValues(events)}
                    eventContent={EventContent}
                    locale={frLocale}
                    weekends={true}
                    allDaySlot={false}
                    slotMinTime={startTime}
                    slotMaxTime={endTime}
                    height={"auto"}
                    // contentHeight="1rem"
                    aspectRatio={1.5}
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
