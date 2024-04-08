"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import iCalendarPlugin from "@fullcalendar/icalendar";
import { updatePeriodDisplay } from "@/utils/fullCalendarHelper";
import { TEventClickArg, TEventTimetable, TView } from "@/types/timetable";
import EventContent from "@/components/timetable/event-content";
import type { User } from "@prisma/client";
import { useDebouncedCallback } from "use-debounce";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import TimetableDrawer from "./TimetableDrawer";
import { reloadData } from "@/utils/timetable";
import TimetableHeader from "./TimetableHeader";

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
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [drawerInfos, setDrawerInfos] = useState<TEventClickArg | undefined>(
        undefined,
    );

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
        <Card className="h-full py-2 md:flex md:h-full md:flex-col md:p-10">
            <CardHeader className="h-1/6">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <TimetableHeader
                        periodDisplay={periodDisplay}
                        className="flex flex-col-reverse items-center justify-center gap-5 md:flex-row"
                        calendarRef={calendarRef}
                        events={events}
                        setEvents={setEvents}
                        setCalendarEvents={setCalendarEvents}
                        setLoading={setLoading}
                        userId={userId}
                    />
                    {loading && <LoaderCircle className="ml-6 animate-spin" />}
                </div>
            </CardHeader>
            {drawerInfos && (
                <TimetableDrawer
                    eventInfo={drawerInfos}
                    open={isDrawerOpen}
                    setOpen={setIsDrawerOpen}
                ></TimetableDrawer>
            )}
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
                    eventClick={(eventClickArgs) => {
                        setDrawerInfos(eventClickArgs ?? undefined);
                        setIsDrawerOpen(true);
                    }}
                    datesSet={async (arg) => {
                        setPeriodDisplay(updatePeriodDisplay(arg));
                        void (await refeshCallback(arg));
                    }}
                />
            </CardContent>
        </Card>
    );
}
