"use server";

import { lines2tree } from "icalts";
import { format } from "date-fns";
import { db } from "@/server/db";
import { CalendarData, CourseEvent } from "@/types/timetable";
import type { User } from "@prisma/client";
import { log, TLog } from "@/logger/logger";

/**
 * This function translates the courses codes to their respective labels
 * @param courses The courses to translate
 */
async function translateCoursesCodes(courses: CourseEvent[]) {
    // Retrieve necessary courses label batch
    for (const course of courses) {
        const dbRef = await db.course.findMany({
            select: {
                name: true,
                year: true,
                small_code: true,
            },
            where: {
                small_code: course.SUMMARY.split(":")[0],
            },
        });

        const found = dbRef.sort(
            (a, b) => parseInt(b.year ?? "0") - parseInt(a.year ?? "0"),
        )[0];
        course.CODE =
            found?.small_code ?? course.SUMMARY.split(":")[0] ?? course.SUMMARY;
        course.NAME = found?.name;
    }
}

/**
 *  This function retrieves the timetable data
 * @param dateFrom
 * @param dateTo
 * @param userId The user id
 * @returns {Promise<TEventTimetable[] | null>} A promise that resolves to the timetable data
 */
export async function getTimetableData(
    dateFrom: number,
    dateTo: number,
    userId: User["id"],
): Promise<CalendarData | null> {
    if (userId == null) return null;
    try {
        const resURL = await db.userTimetableURL.findMany({
            where: {
                userId: userId,
            },
        });

        if (resURL == null) return null;

        // convert the urls to URL objects
        const urls = resURL.map((url) => new URL(url.url));

        // detect if if the url is an ESIEE Paris url
        // get hostname of ESIEE Paris
        const resESIEEUrls = await db.schoolHostname.findMany({
            where: {
                School: {
                    name: "ESIEE Paris",
                },
            },
            select: {
                hostname: true,
            },
        });
        const res: CalendarData = {
            VCALENDAR: [
                {
                    VEVENT: [],
                },
            ],
        };

        for (const url of urls) {
            const urlHostname = url.hostname;
            const isESIEEUrl = resESIEEUrls.find(
                (esieeUrl) => urlHostname === esieeUrl.hostname,
            );

            // if ESIEE Paris url
            if (isESIEEUrl) {
                url.searchParams.delete("nbWeeks");
                url.searchParams.append(
                    "firstDate",
                    format(dateFrom, "yyyy-MM-dd"),
                );
                url.searchParams.append(
                    "lastDate",
                    format(dateTo, "yyyy-MM-dd"),
                );
            }

            const icalData = await fetch(url);
            const rawIcal = await icalData.text();

            const resCalendarJson: CalendarData = lines2tree(
                rawIcal.split("\r\n"),
            ) as unknown as CalendarData;

            if (isESIEEUrl) {
                await translateCoursesCodes(
                    resCalendarJson.VCALENDAR[0].VEVENT ?? [],
                );
            }

            res.VCALENDAR[0].VEVENT.push(
                ...resCalendarJson.VCALENDAR[0].VEVENT,
            );
        }

        return res;
    } catch (error) {
        log({
            type: TLog.error,
            text: "Error in when retrieve timetable data",
        });
        return null;
    }
}
