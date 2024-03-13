"use server";
import { IcalObject } from "ical2json";
import { PLANIF_ENDPOINT } from "@/app/api/ApiHelper";
import { lines2tree } from "icalts";
import { distance } from "fastest-levenshtein";
import { parseISO } from "date-fns";
import ApiFilter from "@/types/apiFilter";
import { db } from "@/server/db";
import { CalendarData, CourseEvent, TEventTimetable } from "@/types/timetable";
import type { User } from "@prisma/client";
import { convert } from "ical2json";
import { TLog, log } from "@/logger/logger";

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
    log({ type: TLog.info, text: "Translating courses codes" });
    // Retrieve necessary courses label batch
    const conditions = [];
    for (const course of courses) {
        const [subject]: string[] = course.SUMMARY.split(":");
        const keywords = subject?.split("-");

        conditions.push({
            AND: keywords?.map((w) => ({
                code_cours: {
                    contains: w,
                },
            })),
        });
    }
    const filter = { OR: conditions };
    const labels = await db.course.findMany({
        where: filter,
    });

    // Translate courses codes
    for (const course of courses) {
        const [subject, type]: string[] = course.SUMMARY.split(":");

        if (subject && COURSES_EXCEPTIONS.includes(subject)) {
            course.SUMMARY = course.SUMMARY.replace(":", " : ");
            continue;
        }

        const label = labels?.reduce((minLabel, currentLabel) => {
            let minDistance = 0;
            let currentDistance = 0;
            subject?.split("-").forEach((w1) => {
                minLabel?.code_cours
                    .split("_")
                    .slice(2)
                    .forEach(
                        (w2) => (minDistance += distanceToCourseCode(w1, w2)),
                    );
                currentLabel.code_cours
                    .split("_")
                    .slice(2)
                    .forEach(
                        (w2) =>
                            (currentDistance += distanceToCourseCode(w1, w2)),
                    );
            });

            return currentDistance < minDistance ? currentLabel : minLabel;
        }, labels[0])?.nom_cours;

        course.SUMMARY =
            label != undefined ? `${label} : ${type}` : `${subject} : ${type}`;
    }
}

/**
 *  This function retrieves the timetable data
 * @param dateFilter The date filter
 * @param modules The modules to get the timetable for
 * @param userId The user id
 * @returns {Promise<TEventTimetable[] | IcalObject | null>} A promise that resolves to the timetable data
 */
export async function getTimetableData(
    dateFilter: ApiFilter<number>,
    userId: User["id"],
    modules?: number[] | null,
): Promise<TEventTimetable[] | IcalObject | null> {
    if (modules == null && userId == null) return null;

    log({ type: TLog.info, text: "Retrieving timetable data" });

    // if there is no modules, we get the url user UserTimetableURL
    if (modules == null) {
        const resURL = await db.userTimetableURL.findFirst({
            where: {
                userId: userId,
            },
        });

        if (resURL == null) return null;

        const icalData = await fetch(resURL.url);

        if (!icalData.ok) return null;

        const rawIcal = await icalData.text();

        const ical = convert(rawIcal);

        return ical;
    }

    try {
        const endpoint = PLANIF_ENDPOINT(dateFilter, modules);

        const response = await fetch(endpoint, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const VCALENDAR = await response.text();

        const res: CalendarData = lines2tree(
            VCALENDAR.split("\r\n"),
        ) as unknown as CalendarData;

        res.VCALENDAR[0].VEVENT = filterCourses(
            res.VCALENDAR[0].VEVENT,
            dateFilter,
        );
        await translateCoursesCodes(res.VCALENDAR[0].VEVENT ?? []);

        const resFormatted =
            res.VCALENDAR[0].VEVENT?.map((event) => {
                return {
                    title: event.SUMMARY,
                    start: event.DTSTART,
                    end: event.DTEND,
                    room: event.LOCATION,
                };
            }) ?? [];

        return resFormatted;
    } catch (error) {
        console.log("Error in when retrieve timetable data:\n", error);
        return null;
    }
}
