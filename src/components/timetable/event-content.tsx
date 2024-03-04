import { TEventInfo } from "@/types/timetable";
import React from "react";
import cn from "classnames";

type PropsEventCotnent = TEventInfo & {
    className?: string;
};

export const EventContent = React.forwardRef<HTMLDivElement, PropsEventCotnent>(
    ({ event, timeText, className }, ref) => {
        return (
            <div
                onClick={() => alert(event.title + " " + timeText)}
                className={cn(
                    "border-sky-100r flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-sky-200 p-5 text-black",
                    className,
                )}
                ref={ref}
            >
                <p className="text-center font-bold">{event.title}</p>
                {/* <p>{timeText}</p> */}
                <p className="text-sm">{event.extendedProps.room}</p>
            </div>
        );
    },
);
EventContent.displayName = "EventContent";

export default EventContent;
