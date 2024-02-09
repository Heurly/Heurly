import { TView } from "@/types/timetable";
import { Ref } from "@fullcalendar/core/preact";

import FullCalendar from "@fullcalendar/react";
import { RefObject } from "react";

export const goToNextPeriod = (calendarRef: RefObject<FullCalendar>): void => {
  if (!calendarRef.current) return;

  const calendarApi = calendarRef.current.getApi();
  const view = calendarApi.view;

  switch (view.type) {
    case TView.dayGridMonth:
      calendarApi.next();
      break;
    case TView.timeGridWeek:
    case TView.dayGridWeek:
      calendarApi.incrementDate({ weeks: 1 });
      break;
    case TView.timeGridDay:
    case TView.dayGridDay:
      calendarApi.incrementDate({ days: 1 });
      break;

    default:
      break;
  }
};

export const goToPreviousPeriod = (
  calendarRef: RefObject<FullCalendar>,
): void => {
  if (!calendarRef.current) return;

  const calendarApi = calendarRef.current.getApi();
  const view = calendarApi.view;

  switch (view.type) {
    case TView.dayGridMonth:
      calendarApi.prev();
      break;
    case TView.timeGridWeek:
    case TView.dayGridWeek:
      calendarApi.incrementDate({ weeks: -1 });
      break;
    case TView.timeGridDay:
    case TView.dayGridDay:
      calendarApi.incrementDate({ days: 1 });
      break;

    default:
      break;
  }
};
