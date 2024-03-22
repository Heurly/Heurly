import { TEventInfo } from "@/types/timetable";

export default function EventContent(eventInfo: TEventInfo) {
    return (
        <div
            onClick={() =>
                alert(
                    `${eventInfo.event.title}\n\nHeure : ${eventInfo.timeText}\nLieu : ${eventInfo.event.extendedProps.room}`,
                )
            }
            className="border-sky-100r flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-sky-200 p-1 text-black hover:border-sky-400"
        >
            <p className="max-h-1/2 w-full overflow-hidden text-ellipsis text-center align-bottom text-[0.65rem]/[0.65rem] font-bold">
                {eventInfo.event.title}
            </p>
            <p className="max-h-1/2 w-full overflow-hidden text-ellipsis text-center align-top text-[0.6rem]/[0.6rem]">
                {eventInfo.event.extendedProps.room}
            </p>
        </div>
    );
}
