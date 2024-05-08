"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import cn from "classnames";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

type PropsDatePicker = {
    onChange: (date: Date) => void;
    className?: string;
    dateInput: Date;
};

export function DatePicker({
    onChange,
    className = "",
    dateInput,
}: PropsDatePicker) {
    // new Date in france timezone
    const [date, setDate] = useState<Date>(dateInput);
    useEffect(() => {
        if (date !== dateInput) onChange(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    useEffect(() => {
        if (dateInput !== date) setDate(dateInput);
    }, [dateInput, date]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            selectedDate.setHours(12);
            onChange(selectedDate);
        } else {
            // Handle the case where selectedDate is undefined, if necessary
            // For example, reset to a default value, or do nothing
            // setDate(new Date()); // Reset to current date or another default value
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start border-0 bg-sky-50 text-left font-normal",
                        !date && "text-muted-foreground",
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP", { locale: fr })
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    ISOWeek
                    locale={fr}
                />
            </PopoverContent>
        </Popover>
    );
}
