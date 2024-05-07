import { DatesSetArg } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import { format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { RefObject } from "react";

export const goToNextPeriod = (calendarRef: RefObject<FullCalendar>): void => {
    if (!calendarRef.current) return;

    const calendarApi = calendarRef.current.getApi();
    const view = calendarApi.view;

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
        case "dayGridThreeDays":
            calendarApi.incrementDate({ days: 3 });
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
        case "dayGridThreeDays":
            calendarApi.incrementDate({ days: -3 });
            break;
        default:
            // Handle other cases or do nothing
            break;
    }
};

// depending on the view the period display is different
/**
 * @param view the current view of the calendar
 */
export const updatePeriodDisplay = (arg: DatesSetArg) => {
    const { view } = arg;
    let formatStr = "";
    switch (view.type) {
        case "timeGridWeek":
            // For a week view, show the start of the week in "dd/MM/yyyy" format.
            formatStr = "dd/MM/yyyy";
            break;
        case "timeGridDay":
            // For a day view, show the day in "dd/MM/yyyy" format.
            formatStr = "dd/MM/yyyy";
            break;
        case "dayGridMonth":
            // For a month view, show the month in "MMMM yyyy" format.
            formatStr = "MMMM yyyy";
            break;
        case "dayGridThreeDays":
            formatStr = "dd/MM/yyyy";
        default:
        // Optionally handle other cases or leave as is for no action.
        // return; // Early return if the view type is not handled.
    }

    // For "timeGridWeek", calculate the start of the week.
    // For other types, use view.currentStart directly.
    const dateToFormat =
        view.type === "timeGridWeek"
            ? startOfWeek(view.currentStart, { weekStartsOn: 1 })
            : view.currentStart;

    const date = format(dateToFormat, formatStr, { locale: fr });

    return date;
};
