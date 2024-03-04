import { TEventInfo } from "@/types/timetable";

export default function EventContent(eventInfo: TEventInfo) {
    return (
        <div
            onClick={() =>
                alert(eventInfo.event.title + " " + eventInfo.timeText)
            }
            className="border-sky-100r flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-sky-200 p-5 text-black"
        >
            <p className="text-center font-bold">{eventInfo.event.title}</p>
            {/* <p>{eventInfo.timeText}</p> */}
            <p className="text-sm">{eventInfo.event.extendedProps.room}</p>
        </div>
    );
}
