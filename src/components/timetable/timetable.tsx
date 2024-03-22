"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
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
import { addDays, addYears, subYears } from "date-fns";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";
import { DatesSetArg } from "@fullcalendar/core/index.js";

export default function Timetable({ userId }: { userId: User["id"] }) {
    const session = useSession();
    const calendarRef = useRef<FullCalendar>(null);
    const [periodDisplay, setPeriodDisplay] = useState<string>("");
    const [events, setEvents] = useState<TEventTimetable[]>([]);
    const [max, setMax] = useState<number | undefined>(undefined);
    const [min, setMin] = useState<number | undefined>(undefined);
    const nbPxPhone = 768;
    const startTime = "08:00:00";
    const endTime = "20:00:00";

    const shouldReload = (dateFrom: Date, dateTo: Date) => {
        let res = false;

        if (min === undefined || dateFrom.getTime() < min) {
            setMin(dateFrom.getTime());
            res = true;
        }
        if (max === undefined || dateTo.getTime() > max) {
            setMax(dateTo.getTime());
            res = true;
        }

        return res;
    };

    const reloadData = async (dateFrom: Date, dateTo: Date) => {
        if (!userId || !shouldReload(dateFrom, dateTo)) return;

        console.log("fetch");
        const ical = await getTimetableData(
            dateFrom.getTime(),
            dateTo.getTime(),
            userId,
        );
        if (ical?.VCALENDAR === undefined) return;

        const events =
            ical?.VCALENDAR[0]?.VEVENT?.map((event) => {
                return {
                    title: event.SUMMARY,
                    start: event.DTSTART,
                    end: event.DTEND,
                    room: event.LOCATION,
                    description: event.DESCRIPTION,
                };
            }) ?? [];
        setEvents(events ?? []);
    };

    const handleDateChange = async (date: Date) => {
        const from = subYears(date, 1);
        const to = addYears(date, 1);

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
                    events={events ?? []}
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
