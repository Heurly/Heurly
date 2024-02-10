import FullCalendar from "@fullcalendar/react";
import { RefObject } from "react";

export const goToNextPeriod = (calendarRef: RefObject<FullCalendar>): void => {
  if (!calendarRef.current) return;

  const calendarApi = calendarRef.current.getApi();
  const view = calendarApi.view;
  console.log("goToNextPeriod")

  switch (view.type) {
    case "dayGridMonth":
      calendarApi.next();
      break;
    case "timeGridWeek":
    case "dayGridWeek":
      calendarApi.incrementDate({ weeks: 1 });
      break;
    case "timeGridDay":
    case "dayGridDay":
      calendarApi.incrementDate({ days: 1 });
      break;
    default:
      // Handle other cases or do nothing
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
    case "dayGridMonth":
      calendarApi.prev();
      break;
    case "timeGridWeek":
    case "dayGridWeek":
      calendarApi.incrementDate({ weeks: -1 });
      break;
    case "timeGridDay":
    case "dayGridDay":
      calendarApi.incrementDate({ days: -1 });
      break;
    default:
      // Handle other cases or do nothing
      break;
  }

};
