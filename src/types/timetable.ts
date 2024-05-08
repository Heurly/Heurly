import type { ViewApi } from "@fullcalendar/core/index.js";

export enum TView {
	timeGridDay = "timeGridDay",
	timeGridWeek = "timeGridWeek",
	dayGridMonth = "dayGridMonth",
	dayGridDay = "dayGridDay",
	dayGridWeek = "dayGridWeek",
	dayGridThreeDays = "dayGridThreeDays",
}

export interface CourseEvent {
	CODE: string;
	DTSTART: string;
	DTEND: string;
	SUMMARY: string;
	LOCATION: string;
	DESCRIPTION: string;
	NAME?: string;
	TYPE?: string;
	COURSE_ID?: number;
}

export type CalendarData = {
	VCALENDAR: [
		{
			VEVENT: CourseEvent[];
		},
	];
};

export type TEventExtendedProps = {
	code?: string;
	room?: string;
	small?: boolean;
	name?: string;
	type?: string;
	courseId?: number;
};

export type TEventInstance = {
	range?: {
		start?: Date;
		end?: Date;
	};
};

export type TEventInfo = {
	event: {
		_instance?: TEventInstance;
		title: string;
		extendedProps: TEventExtendedProps;
	};
	timeText: string;
};

export type TEventTimetable = {
	code: string;
	title: string;
	start: string;
	end: string;
	room: string;
	description?: string;
	small?: boolean;
	name?: string;
	type?: string;
	courseId?: number;
};

export interface TEventClickArg {
	el: HTMLElement;
	event: {
		_def: {
			extendedProps: TEventExtendedProps;
			title: string;
		};
		_instance: TEventInstance | null;
	};
	jsEvent: MouseEvent;
	view: ViewApi;
}
