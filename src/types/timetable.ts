export enum TView {
    timeGridDay = "timeGridDay",
    timeGridWeek = "timeGridWeek",
    dayGridMonth = "dayGridMonth",
    dayGridDay = "dayGridDay",
    dayGridWeek = "dayGridWeek",
}

export interface CourseEvent {
    DTSTART: string;
    DTEND: string;
    SUMMARY: string;
    LOCATION: string;
    DESCRIPTION: string;
}

export type CalendarData = {
    VCALENDAR: [
        {
            VEVENT: CourseEvent[];
        },
    ];
};

export type TEventInfo = {
    event: {
        title: string;
        extendedProps: {
            room: string;
        };
    };
    timeText: string;
};

export type TEventTimetable = {
    title: string;
    start: string;
    end: string;
    room: string;
};
