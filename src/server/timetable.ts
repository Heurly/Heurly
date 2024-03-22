"use server";
import { lines2tree } from "icalts";
import { format } from "date-fns";
import { db } from "@/server/db";
import { CalendarData, CourseEvent } from "@/types/timetable";
import type { User } from "@prisma/client";

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
 * @returns {Promise<TEventTimetable[] | null>} A promise that resolves to the timetable data
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
