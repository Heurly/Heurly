import type { TEventTimetable } from "@/types/timetable";
import { goToNextPeriod, goToPreviousPeriod } from "@/utils/fullCalendarHelper";
import { handleDateChange } from "@/utils/timetable";
import type { RefObject } from "@fullcalendar/core/preact.js";
import type FullCalendar from "@fullcalendar/react";
import {
    ArrowLeft,
    ArrowRight,
    FlagTriangleRight,
    LoaderCircle,
} from "lucide-react";
import type React from "react";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/datepicker";

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
                    <p className="hidden md:block">Aujourd&apos;hui</p>
                </Button>
            )}
            {loading && (
                <LoaderCircle className="ml-6 hidden animate-spin md:block" />
            )}
            {expandHeader && (
                <p data-cy="periodDisplay" className="ml-auto hidden md:block">
                    {/* {periodDisplay} */}
                </p>
            )}
            <Button
                className="-order-1 rounded-full bg-sky-50 md:order-[unset]"
                onClick={() => goToPreviousPeriod(calendarRef)}
                data-cy="previousPeriodBtn"
            >
                <ArrowLeft className="text-black" />
            </Button>
            <Button
                className="rounded-full bg-sky-50"
                onClick={() => goToNextPeriod(calendarRef)}
                data-cy="nextPeriodBtn"
            >
                <ArrowRight className="text-black" />
            </Button>
        </div>
    );
};

export default TimetableHeader;
