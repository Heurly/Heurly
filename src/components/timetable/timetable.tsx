"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import iCalendarPlugin from '@fullcalendar/icalendar'
import { goToNextPeriod, goToPreviousPeriod, updatePeriodDisplay } from "@/utils/fullCalendarHelper";
import { CalendarData, TView } from "@/types/timetable";
import EventContent from "@/components/timetable/EventContent";

export default function Timetable({ tabEvents }: { tabEvents: CalendarData | null }) {
    const calendarRef = useRef<FullCalendar>(null);
    const [periodDisplay, setPeriodDisplay] = useState<string>("");
    const nbPxPhone = 768;
    const startTime = "08:00:00";
    const endTime = "20:00:00";

    const handleDateChange = (date: Date) => {
        const newDate = date.toISOString().slice(0, 10);
        if (calendarRef.current) calendarRef.current.getApi().gotoDate(newDate);
    };

    useEffect(() => {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth < nbPxPhone;
            if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.changeView(isMobile ? TView.timeGridDay : TView.timeGridWeek)
            }
        };

        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    return (

        <Card className="h-[100svh] md:h-full md:p-10 md:flex md:flex-col py-2">
            <CardHeader>
                <div className="flex md:flex-row flex-col justify-between items-center">
                    <div className="flex flex-col-reverse md:flex-row mb-3 items-center justify-center gap-5">
                        <DatePicker
                            onChange={handleDateChange}
                            className="hidden md:flex"
                        />
                        <Button
                            className="bg-sky-50 text-black hidden md:block"
                            onClick={() => handleDateChange(new Date())}
                            data-cy="todayBtn"
                        >
                            Aujourd&apos;hui
                        </Button>
                    </div>
                    <div className="flex gap-x-5 w-full items-center justify-center md:justify-end">
                        <Button
                            className="bg-sky-50 rounded-full aspect-square p-3 md:order-2"
                            onClick={() => goToPreviousPeriod(calendarRef)}
                            data-cy="previousPeriodBtn"
                        >
                            <ArrowLeft className=" h-9 w-9 text-black" size={60} />
                        </Button>
                        <p data-cy="periodDisplay" className="md:order-1 hidden md:block">
                            {periodDisplay}
                        </p>
                        <DatePicker onChange={handleDateChange} className="md:hidden" />
                        <Button
                            className="bg-sky-50 rounded-full aspect-square p-3 md:order-3"
                            onClick={() => goToNextPeriod(calendarRef)}
                            data-cy="nextPeriodBtn"
                        >
                            <ArrowRight className="text-black" size={60} />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="h-full">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin]}
                    initialView={TView.timeGridWeek}
                    headerToolbar={false}
                    events={tabEvents ?? []}
                    eventContent={EventContent}
                    locale={frLocale}
                    weekends={true}
                    allDaySlot={false}
                    slotMinTime={startTime}
                    slotMaxTime={endTime}
                    height={"auto"}
                    // contentHeight="1rem"
                    aspectRatio={1.5}
                    datesSet={(arg) => {
                        setPeriodDisplay(updatePeriodDisplay(arg))
                    }}
                />
            </CardContent>
        </Card>

    );
}
