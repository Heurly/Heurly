"use server";
import { IcalObject } from "ical2json";
import { PLANIF_ENDPOINT } from "@/app/api/ApiHelper";
import { lines2tree } from "icalts";
import { distance } from "fastest-levenshtein";
import { format, parseISO } from "date-fns";
import ApiFilter from "@/types/apiFilter";
import { db } from "@/server/db";
import { CalendarData, CourseEvent, TEventTimetable } from "@/types/timetable";
import type { User } from "@prisma/client";
import { log, TLog } from "@/logger/logger";

const COURSES_EXCEPTIONS = ["BDE"];

/**
 * This function filters the courses
 * @param courses The courses to filter
 * @param dateFilter The date filter
 * @returns {CourseEvent[]} The filtered courses
 */
function filterCourses(courses: CourseEvent[], dateFilter: ApiFilter<number>) {
    log({ type: TLog.info, text: "Filtering courses" });
    if (dateFilter.equals != undefined) {
        courses = courses.filter((m) => {
            const start = parseISO(m.DTSTART);
            start.setHours(0, 0, 0, 0);

            return (
                dateFilter.equals != undefined &&
                start.getTime() == dateFilter.equals
            );
        });
    }

    return courses;
}

/**
 * This function calculates the distance between two strings
 * @param target The target string
 * @param entry The entry string
 * @returns {number} The distance between the two strings
 */
function distanceToCourseCode(target: string, entry: string): number {
    log({ type: TLog.info, text: "Calculating distance to course code" });
    if (entry.length > target.length) {
        const strippedEntry = entry.slice(0, entry.length - 1);

        if (strippedEntry == target) {
            return 0;
        }
    }

    return distance(target, entry);
}

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
            },
            where: {
                small_code: course.SUMMARY.split(":")[0],
            },
        });

        course.SUMMARY =
            dbRef.sort(
                (a, b) => parseInt(b.year ?? "0") - parseInt(a.year ?? "0"),
            )[0]?.name ?? course.SUMMARY;
    }
}

/**
 *  This function retrieves the timetable data
 * @param dateFrom
 * @param dateTo
 * @param userId The user id
 * @returns {Promise<TEventTimetable[] | IcalObject | null>} A promise that resolves to the timetable data
 */
export async function getTimetableData(
    dateFrom: number,
    dateTo: number,
    userId: User["id"],
): Promise<CalendarData | null> {
    if (userId == null) return null;
    try {
        const resURL = await db.userTimetableURL.findFirst({
            where: {
                userId: userId,
            },
        });

        if (resURL == null) return null;

        const url = new URL(resURL.url);

        url.searchParams.delete("nbWeeks");
        url.searchParams.append("firstDate", format(dateFrom, "yyyy-MM-dd"));
        url.searchParams.append("lastDate", format(dateTo, "yyyy-MM-dd"));

        const icalData = await fetch(url);
        const rawIcal = await icalData.text();

        const res: CalendarData = lines2tree(
            rawIcal.split("\r\n"),
        ) as unknown as CalendarData;
        await translateCoursesCodes(res.VCALENDAR[0].VEVENT ?? []);

        return res;
    } catch (error) {
        console.log("Error in when retrieve timetable data:\n", error);
        return null;
    }
}
