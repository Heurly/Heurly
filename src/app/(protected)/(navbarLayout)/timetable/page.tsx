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
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { goToNextPeriod, goToPreviousPeriod } from "./fullCalendarHelper";
import { TView } from "@/types/timetable";
import EventContent from "@/components/timetable/EventContent";
import { PLANIF_ENDPOINT } from "@/app/api/ApiHelper";
// import ICAL from "ical.js";

const today = new Date();

const createEventDate = (dayOffset: number, hours: number, minutes: number) => {
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + dayOffset,
    hours,
    minutes,
  );
};

export default function Timetable() {
  const calendarRef = useRef<FullCalendar>(null);
  const [periodDisplay, setPeriodDisplay] = useState<string>("");
  const [currentView, setCurrentView] = useState<TView>(TView.timeGridWeek);
  const nbPxPhone = 768;
  const startTime: string = "08:00:00";
  const endTime: string = "20:00:00";
  const [events, setEvents] = useState([]);

  const handleDateChange = (date: Date) => {
    const newDate = date.toISOString().slice(0, 10);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(newDate);
  };

  // depending on the view the period display is different
  /**
   * @param view the current view of the calendar
   */
  const updatePeriodDisplay = (view: any) => {
    let display = "";
    if (view.type.includes("Week")) {
      const start = startOfWeek(view.currentStart, { weekStartsOn: 1 });
      display = `${format(start, "dd/MM/yyyy", { locale: fr })}`;
    } else if (view.type.includes("Day")) {
      display = `${format(view.currentStart, "dd/MM/yyyy", {
        locale: fr,
      })}`;
    } else if (view.type.includes("Month")) {
      display = `${format(view.currentStart, "MMMM yyyy", {
        locale: fr,
      })}`;
    }
    setPeriodDisplay(display);
  };

  const onDateSet = (arg: DatesSetArg) => {
    updatePeriodDisplay(arg.view);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < nbPxPhone;
      setCurrentView(isMobile ? TView.timeGridDay : TView.timeGridWeek);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // ical fetching --------------
    // Fetch iCal data (e.g., from a URL or a file)

    console.log(
      PLANIF_ENDPOINT(
        {
          lower: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).getTime(),
          greater: new Date(Date.now()).getTime(),
        },
        [3033],
      ),
    );

    // fetch(PLANIF_ENDPOINT({
    //   lower: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).getTime(),
    //   greater: new Date(Date.now()).getTime(),
    // }, [3033]))
    //   .then((response) => response.text())
    //   .then((data) => {
    //     const jcalData = ICAL.parse(data);
    //     const comp = new ICAL.Component(jcalData);
    //     const vevents = comp.getAllProperties('vevent');
    //     const parsedEvents: any = [];

    //     vevents.forEach((vevent: any) => {
    //       const event = {
    //         title: vevent.getFirstValue('summary'),
    //         start: vevent.getFirstValue('dtstart').toJSDate(),
    //         end: vevent.getFirstValue('dtend').toJSDate(),
    //       };
    //       parsedEvents.push(event);
    //     });
    //     console.log(parsedEvents)
    //     setEvents(parsedEvents);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching iCal data:', error);
    //   });

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(currentView);
    }
  }, [currentView]);

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
                Aujourd'hui
              </Button>
            </div>
            <div className="flex gap-x-5 w-full items-center justify-center md:justify-end">
              <Button
                className="bg-sky-50 rounded-full aspect-square p-3 md:order-2"
                onClick={() => goToPreviousPeriod(calendarRef)}
                data-cy="previousPeriodBtn"
              >
                <ArrowLeft className="h-4 w-4 text-black" />
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
                <ArrowRight className="h-4 w-4 text-black" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView={currentView}
            headerToolbar={false}
            events={{
              url: PLANIF_ENDPOINT(
                {
                  greater: new Date(Date.now()).getTime(),
                  lower: new Date(
                    Date.now() + 1000 * 60 * 60 * 24 * 7,
                  ).getTime(),
                },
                [3033],
              ),
              format: "ics",
            }}
            eventContent={EventContent}
            locale={frLocale}
            weekends={true}
            allDaySlot={false}
            slotMinTime={startTime}
            slotMaxTime={endTime}
            height={"auto"}
            // contentHeight="1rem"
            aspectRatio={1.5}
            datesSet={onDateSet}
          />
        </CardContent>
      </Card>
    </main>
  );
}
