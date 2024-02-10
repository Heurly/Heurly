"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { startOfWeek } from "date-fns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DatesSetArg } from "@fullcalendar/core";
import iCalendarPlugin from '@fullcalendar/icalendar'
import { goToNextPeriod, goToPreviousPeriod } from "./fullCalendarHelper";
import { TView } from "@/types/timetable";
import EventContent from "@/components/timetable/EventContent";
import { PLANIF_ENDPOINT } from "@/app/api/ApiHelper";
// import ICAL from "ical.js";

// const today = new Date();

// const createEventDate = (dayOffset: number, hours: number, minutes: number) => {
//   return new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     today.getDate() + dayOffset,
//     hours,
//     minutes,
//   );
// };

export default function Timetable() {
  const calendarRef = useRef<FullCalendar>(null);
  const [periodDisplay, setPeriodDisplay] = useState<string>("");
  const nbPxPhone = 768;
  const startTime = "08:00:00";
  const endTime = "20:00:00";
  const [events, setEvents] = useState([]);

  const handleDateChange = (date: Date) => {
    const newDate = date.toISOString().slice(0, 10);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(newDate);
  };

  // depending on the view the period display is different
  /**
   * @param view the current view of the calendar
   */

  const updatePeriodDisplay = (arg: DatesSetArg) => {
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
      default:
        // Optionally handle other cases or leave as is for no action.
        console.log(`Unhandled view type: ${view.type}`);
        return; // Early return if the view type is not handled.
    }

    // For "timeGridWeek", calculate the start of the week.
    // For other types, use view.currentStart directly.
    const dateToFormat = view.type === "timeGridWeek"
      ? startOfWeek(view.currentStart, { weekStartsOn: 1 })
      : view.currentStart;

    const display = format(dateToFormat, formatStr, { locale: fr });
    console.log("updatePeriodDisplay", display);
    setPeriodDisplay(display);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < nbPxPhone;
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(isMobile ? TView.timeGridDay : TView.timeGridWeek)
        console.log("checkScreenSize", calendarApi.view)
      }
    };

    window.addEventListener("resize", checkScreenSize);

    // fetch("https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=530,3258,3261,3333&projectId=11&calType=ical&nbWeeks=4", {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*"
    //   }
    // }).then((res) => console.log(res)).then((data) => console.log(data))



    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <main className="w-full h-full">
      <Card className="h-[100svh] md:h-full md:p-10 md:flex md:flex-col py-2">
        <CardHeader>
          <div className="flex md:flex-row flex-col justify-between items-center">
            <div className="flex flex-col-reverse md:flex-row mb-3 items-center justify-center gap-5">
              <DatePicker
                onChange={handleDateChange}
                className="hidden md:flex"
              />
              <Button
                className="bg-sky-50 text-black hidden md:block"
                onClick={() => handleDateChange(new Date())}
                data-cy="todayBtn"
              >
                Aujourd&apos;hui
              </Button>
            </div>
            <div className="flex gap-x-5 w-full items-center justify-center md:justify-end">
              <Button
                className="bg-sky-50 rounded-full aspect-square p-3 md:order-2"
                onClick={() => goToPreviousPeriod(calendarRef)}
                data-cy="previousPeriodBtn"
              >
                <ArrowLeft className=" h-9 w-9 text-black" size={60} />
              </Button>
              <p data-cy="periodDisplay" className="md:order-1 hidden md:block">
                {periodDisplay}
              </p>
              <DatePicker onChange={handleDateChange} className="md:hidden" />
              <Button
                className="bg-sky-50 rounded-full aspect-square p-3 md:order-3"
                onClick={() => goToNextPeriod(calendarRef)}
                data-cy="nextPeriodBtn"
              >
                <ArrowRight className="text-black" size={60} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin]}
            initialView={TView.timeGridWeek}
            headerToolbar={false}
            events={[]}
            eventContent={EventContent}
            locale={frLocale}
            weekends={true}
            allDaySlot={false}
            slotMinTime={startTime}
            slotMaxTime={endTime}
            height={"auto"}
            // contentHeight="1rem"
            aspectRatio={1.5}
            datesSet={updatePeriodDisplay}
          />
        </CardContent>
      </Card>
    </main>
  );
}
