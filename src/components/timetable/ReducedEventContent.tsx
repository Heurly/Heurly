"use client";
import type { TEventInfo } from "@/types/timetable";

export default function ReducedEventContent(eventInfo: TEventInfo) {
	return (
		<div className="border-sky-100r flex h-full w-full cursor-pointer items-center justify-center rounded-xl border bg-sky-200 text-black hover:border-sky-400">
			<p className="w-full text-center text-[0.65rem]/[0.7rem] font-bold">
				{eventInfo.event.extendedProps.name ?? eventInfo.event.title}
			</p>
		</div>
	);
}
