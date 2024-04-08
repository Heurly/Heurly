"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarSearch } from "lucide-react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import { TEventTimetable, TView } from "@/types/timetable";
import { useDebouncedCallback } from "use-debounce";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import { updatePeriodDisplay } from "@/utils/fullCalendarHelper";
import EventContent from "../timetable/event-content";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import { reloadData } from "@/utils/timetable";
import TimetableHeader from "../timetable/TimetableHeader";
import ReducedEventContent from "../timetable/ReducedEventContent";

interface Props {
    className?: string;
    userId: string;
}

const nbPxPhone = 768;
const startTime = "08:00:00";
const endTime = "20:00:00";

const EventSelect: React.FunctionComponent<Props> = ({ className, userId }) => {
    const session = useSession();

    const calendarRef = useRef<FullCalendar>(null);
    const [periodDisplay, setPeriodDisplay] = useState<string>("");
    const [events, setEvents] = useState<Map<string, TEventTimetable[]>>(
        new Map(),
    );
    const [loading, setLoading] = useState<boolean>(true);
    // Apparently, Fullcalendar doesn't update the display if we put the map events directly to the component.
    const [calendarEvents, setCalendarEvents] = useState<TEventTimetable[]>([]);

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

    return (
        <Popover>
            <PopoverTrigger>
                <CalendarSearch />
            </PopoverTrigger>
            <PopoverContent className={className}>
                <TimetableHeader
                    className="flex h-1/5 w-full flex-col-reverse items-center justify-center gap-5 md:flex-row"
                    calendarRef={calendarRef}
                    events={events}
                    setEvents={setEvents}
                    setCalendarEvents={setCalendarEvents}
                    setLoading={setLoading}
                    userId={userId}
                    periodDisplay={periodDisplay}
                />
                <div className="h-3/4 w-full">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            iCalendarPlugin,
                        ]}
                        initialView={TView.timeGridWeek}
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
                        eventClick={(eventClickArgs) => {}}
                        datesSet={async (arg) => {
                            setPeriodDisplay(updatePeriodDisplay(arg));
                            void (await refeshCallback(arg));
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default EventSelect;
