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

export interface Calendar {
  VCALENDAR: {
    VEVENT: Event[];
  }[];
}

export type ModuleChoice = {
  label: string;
  code: number;
};

export type CalendarData = {
  VCALENDAR: [
    {
      VEVENT: CourseEvent[];
    },
  ];
}