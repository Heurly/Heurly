"use server";
import type { User } from "@prisma/client";
import { db } from "./db";
import * as z from "zod";
import { convert } from "ical2json";
import { TLog, log } from "@/logger/logger";

async function addProfileUnitByUrl(
    userId: User["id"],
    url: string,
): Promise<boolean> {
    log({ type: TLog.info, text: `Adding profile URL for ${userId}` });
    try {
        const urlSchema = z.string().url();
        // This will throw if the URL is invalid, so let's wrap it in a try-catch
        urlSchema.parse(url);

        // Further processing...
        const urlHostName = new URL(url).hostname;
        const res = await db.schoolHostname.findFirst({
            where: { hostname: urlHostName },
        });

        if (res === null) throw new Error("Hostname not found in db");

        // Fetching and processing the ical
        const resIcal = await fetch(url);
        if (!resIcal.ok) throw new Error("Failed to fetch ical");

        const rawIcal = await resIcal.text();
        convert(rawIcal);

        // verify if the url is not already in the database
        const urlExists = await db.userTimetableURL.findFirst({
            where: { url: url, userId: userId },
        });

        if (urlExists !== null)
            throw new Error("URL already exists in the database");

        // Insert the URL into the database
        await db.userTimetableURL.create({
            data: { userId: userId, url: url },
        });

        // If everything passed, we consider it a success
        return true;
    } catch (e) {
        console.error(e);
        // If there's any error, we consider the operation failed
        return false;
    }
}

//
// return ical;

export { addProfileUnitByUrl };
