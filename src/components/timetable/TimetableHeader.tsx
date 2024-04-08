import { TEventTimetable } from "@/types/timetable";
import { handleDateChange } from "@/utils/timetable";
import { RefObject } from "@fullcalendar/core/preact.js";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import { DatePicker } from "../ui/datepicker";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { goToNextPeriod, goToPreviousPeriod } from "@/utils/fullCalendarHelper";

interface Props {
    className?: string;
    calendarRef: RefObject<FullCalendar>;
    events: Map<string, TEventTimetable[]>;
    setEvents: (e: Map<string, TEventTimetable[]>) => void;
    setCalendarEvents: (e: TEventTimetable[]) => void;
    setLoading: (v: boolean) => void;
    userId: string;
    periodDisplay: string;
}

const TimetableHeader: React.FunctionComponent<Props> = ({
    className,
    calendarRef,
    events,
    setEvents,
    setCalendarEvents,
    setLoading,
    userId,
    periodDisplay,
}) => {
    return (
        <div className={className}>
            <DatePicker
                onChange={(d: Date) =>
                    handleDateChange(
                        calendarRef,
                        d,
                        events,
                        setEvents,
                        setCalendarEvents,
                        setLoading,
                        userId,
                    )
                }
                className="hidden md:flex"
            />
            <Button
                className="hidden bg-sky-50 text-black md:block"
                onClick={() =>
                    handleDateChange(
                        calendarRef,
                        new Date(),
                        events,
                        setEvents,
                        setCalendarEvents,
                        setLoading,
                        userId,
                    )
                }
                data-cy="todayBtn"
            >
                Aujourd&apos;hui
            </Button>
            <Button
                className="aspect-square rounded-full bg-sky-50 p-3 md:order-2"
                onClick={() => goToPreviousPeriod(calendarRef)}
                data-cy="previousPeriodBtn"
            >
                <ArrowLeft className=" h-9 w-9 text-black" size={60} />
            </Button>
            <p data-cy="periodDisplay" className="hidden md:order-1 md:block">
                {periodDisplay}
            </p>
            <DatePicker
                onChange={(d: Date) =>
                    handleDateChange(
                        calendarRef,
                        d,
                        events,
                        setEvents,
                        setCalendarEvents,
                        setLoading,
                        userId,
                    )
                }
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
    );
};

export default TimetableHeader;
