import React from "react";
import { TEventTimetable } from "@/types/timetable";
import { handleDateChange } from "@/utils/timetable";
import { RefObject } from "@fullcalendar/core/preact.js";
import FullCalendar from "@fullcalendar/react";
import { DatePicker } from "../ui/datepicker";
import { Button } from "../ui/button";
import {
    ArrowLeft,
    ArrowRight,
    FlagTriangleRight,
    LoaderCircle,
} from "lucide-react";
import { goToNextPeriod, goToPreviousPeriod } from "@/utils/fullCalendarHelper";

interface Props {
    className?: string;
    calendarRef: RefObject<FullCalendar>;
    events: Map<string, TEventTimetable[]>;
    setEvents: (e: Map<string, TEventTimetable[]>) => void;
    setCalendarEvents: (e: TEventTimetable[]) => void;
    userId: string;
    periodDisplay: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    expandHeader?: boolean;
}

const TimetableHeader: React.FunctionComponent<Props> = ({
    className,
    calendarRef,
    events,
    setEvents,
    setCalendarEvents,
    userId,
    periodDisplay,
    loading,
    setLoading,
    expandHeader,
}) => {
    const date = calendarRef.current?.getApi().getDate();

    if (!date) return null;
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
                dateInput={date}
            />
            {expandHeader && (
                <Button
                    className="bg-sky-50 text-black"
                    onClick={() =>
                        handleDateChange(
                            calendarRef,
                            new Date(new Date().setHours(12)),
                            events,
                            setEvents,
                            setCalendarEvents,
                            setLoading,
                            userId,
                        )
                    }
                    data-cy="todayBtn"
                >
                    <FlagTriangleRight />
                    <a className="hidden md:block">Aujourd&apos;hui</a>
                </Button>
            )}
            {loading && <LoaderCircle className="ml-6 animate-spin" />}
            {expandHeader && (
                <p data-cy="periodDisplay" className="ml-auto hidden md:block">
                    {/* {periodDisplay} */}
                </p>
            )}
            <Button
                className="-order-1 aspect-square rounded-full bg-sky-50 p-3 md:order-[unset]"
                onClick={() => goToPreviousPeriod(calendarRef)}
                data-cy="previousPeriodBtn"
            >
                <ArrowLeft className="text-black" size={45} />
            </Button>
            <Button
                className="aspect-square rounded-full bg-sky-50 p-3"
                onClick={() => goToNextPeriod(calendarRef)}
                data-cy="nextPeriodBtn"
            >
                <ArrowRight className="text-black" size={45} />
            </Button>
        </div>
    );
};

export default TimetableHeader;
