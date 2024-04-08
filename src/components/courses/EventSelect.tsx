"use client";
import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { TEventTimetable, TView } from "@/types/timetable";
import { useDebouncedCallback } from "use-debounce";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import { updatePeriodDisplay } from "@/utils/fullCalendarHelper";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import { reloadData } from "@/utils/timetable";
import TimetableHeader from "../timetable/TimetableHeader";
import ReducedEventContent from "../timetable/ReducedEventContent";
import { CourseDate } from "@/types/courses";

interface Props {
    className?: string;
    userId: string;
    setValue: (c: CourseDate) => void;
}

const nbPxPhone = 768;
const startTime = "08:00:00";
const endTime = "20:00:00";

const EventSelect: React.FunctionComponent<Props> = ({
    className,
    userId,
    setValue,
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    const [periodDisplay, setPeriodDisplay] = useState<string>("");
    const [events, setEvents] = useState<Map<string, TEventTimetable[]>>(
        new Map(),
    );
    const [loading, setLoading] = useState<boolean>(true);
    // Apparently, Fullcalendar doesn't update the display if we put the map events directly to the component.
    const [calendarEvents, setCalendarEvents] = useState<TEventTimetable[]>([]);

    const refeshCallback = useDebouncedCallback(async (arg: DatesSetArg) => {
        setLoading(true);
        await reloadData(
            events,
            setEvents,
            setCalendarEvents,
            arg.start,
            arg.end,
            userId,
        );
        setLoading(false);
    }, 1000);

    useEffect(() => {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth < nbPxPhone;
            if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.changeView(
                    isMobile ? TView.timeGridDay : TView.dayGridThreeDays,
                );
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    return (
        <div className={className}>
            <TimetableHeader
                className="flex h-1/5 w-full flex-col-reverse items-center justify-center gap-5 md:flex-row"
                calendarRef={calendarRef}
                events={events}
                setEvents={setEvents}
                setCalendarEvents={setCalendarEvents}
                userId={userId}
                periodDisplay={periodDisplay}
                loading={loading}
                setLoading={setLoading}
            />
            <div className="h-3/4 w-full">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin]}
                    initialView={"dayGridThreeDays"}
                    views={{
                        dayGridThreeDays: {
                            type: "timeGridWeek",
                            duration: { days: 3 },
                        },
                    }}
                    headerToolbar={false}
                    events={calendarEvents}
                    eventContent={ReducedEventContent}
                    locale={frLocale}
                    weekends={true}
                    allDaySlot={false}
                    slotMinTime={startTime}
                    slotMaxTime={endTime}
                    height={"100%"}
                    nowIndicator={true}
                    eventClick={(eventClickArgs) => {
                        if (
                            eventClickArgs?.event?.extendedProps?.courseId ===
                                undefined &&
                            eventClickArgs?.event?.startStr === undefined
                        )
                            return;

                        setValue({
                            courseId: eventClickArgs.event.extendedProps
                                .courseId as number,
                            courseDate: new Date(eventClickArgs.event.startStr),
                        });
                    }}
                    datesSet={async (arg) => {
                        setPeriodDisplay(updatePeriodDisplay(arg));
                        void (await refeshCallback(arg));
                    }}
                />
            </div>
        </div>
    );
};

export default EventSelect;
