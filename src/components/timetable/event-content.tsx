"use client";
import { TEventInfo } from "@/types/timetable";

export default function EventContent(eventInfo: TEventInfo) {
    return (
        <div className="border-sky-100r flex h-full w-full cursor-pointer items-center justify-center rounded-xl border bg-sky-200 text-black hover:border-sky-400">
            {eventInfo.event.extendedProps.small ? (
                <div className="flex h-full w-full items-center justify-center text-nowrap p-1 ">
                    <p className="max-h-1/2 w-full overflow-hidden text-ellipsis text-center align-bottom text-[0.65rem]/[0.7rem] font-bold">
                        {eventInfo.event.extendedProps.name ??
                            eventInfo.event.extendedProps.code ??
                            ""}
                    </p>
                    <p className="max-h-1/2 w-full overflow-hidden text-ellipsis text-center align-top text-[0.6rem]/[0.6rem]">
                        {`${eventInfo.event.extendedProps.type ?? ""} ${eventInfo.event.extendedProps.room ?? ""}`}
                    </p>
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <p className="ml-1 overflow-hidden text-ellipsis text-center text-[0.65rem]/[0.7rem] font-bold">
                        {eventInfo.event.extendedProps.name ??
                            eventInfo.event.extendedProps.code ??
                            ""}
                    </p>
                    <p className="overflow-hidden text-ellipsis text-center text-[0.6rem]/[0.6rem]">
                        {`${eventInfo.event.extendedProps.type ?? ""} ${eventInfo.event.extendedProps.room ?? ""}`}
                    </p>
                </div>
            )}
        </div>
    );
}
