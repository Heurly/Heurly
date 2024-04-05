"use server";
import type { Role, User } from "@prisma/client";
import { db } from "./db";
import * as z from "zod";
import { convert } from "ical2json";
import { TLog, log } from "@/logger/logger";

export async function getUsers(nbUser = 10) {
    let users: User[] = [];

    try {
        users = await db.user.findMany({
            take: nbUser,
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error fetching users: ${e.message}`,
            });
        }
    }
    return users;
}

export type UserWithRole = User & {
    UserRole: [
        {
            role: Role;
        },
    ];
};

export async function getUsersWithRole(
    nbUsers = 10,
): Promise<UserWithRole[] | null> {
    let users: UserWithRole[] | null = null;

    try {
        users = (await db.user.findMany({
            take: nbUsers,
            include: {
                UserRole: {
                    select: {
                        role: true,
                    },
                },
            },
        })) as UserWithRole[];
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error fetching users with role: ${e.message}`,
            });
        }
    }
    return users;
}

/**
 * This function adds a profile unit by URL
 * @param userId The id of the user to add the profile unit to
 * @param url The URL of the profile unit
 * @returns {Promise<boolean>} A promise that resolves to a boolean
 */
export async function addProfileUnitByUrl(
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

/**
 * Updates a profile unit URL for a specific user.
 * @param userId The ID of the user whose profile unit URL needs updating.
 * @param newUrl The new URL to update in the user's profile.
 * @returns A promise that resolves to a boolean indicating the operation's success.
 */
export async function updateProfileUnitUrl(
    userId: string, // Assuming user ID is a string; adjust according to your User model
    newUrl: string,
): Promise<boolean> {
    log({ type: TLog.info, text: `Updating profile URL for user ${userId}` });

    try {
        const urlSchema = z.string().url();
        // Validate the URL
        urlSchema.parse(newUrl);

        // Extract hostname to ensure it matches a known school's hostname
        const urlHostName = new URL(newUrl).hostname;
        const res = await db.schoolHostname.findFirst({
            where: { hostname: urlHostName },
        });

        if (res === null) throw new Error("Hostname not found in db");

        // Fetching and converting the iCal to verify the URL is valid and accessible
        const resIcal = await fetch(newUrl);
        if (!resIcal.ok)
            throw new Error("Failed to fetch ical from the new URL");

        const rawIcal = await resIcal.text();
        convert(rawIcal);

        // Check if the new URL is already associated with another timetable to prevent duplicates
        const urlExists = await db.userTimetableURL.findFirst({
            where: { url: newUrl, NOT: { userId: userId } },
        });

        if (urlExists) throw new Error("URL already used by another timetable");

        // Update the URL in the database
        const updateResult = await db.userTimetableURL.updateMany({
            where: { userId: userId },
            data: { url: newUrl },
        });

        if (updateResult.count === 0)
            throw new Error("Failed to update the URL in the database");

        return true;
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error updating profile URL for user ${userId}: ${e.message}`,
            });
        }
        return false;
    }
}

/**
 * Retrieves all profile unit URLs for a specific user.
 * @param userId The ID of the user whose profile unit URLs are being requested.
 * @returns A promise that resolves to an array of URL strings. The array is empty if no URLs are found.
 */
export async function getCurrentProfileUnitUrls(
    userId: string, // Adjust according to your User model's ID type
): Promise<string[]> {
    log({
        type: TLog.info,
        text: `Fetching current profile URLs for user ${userId}`,
    });

    try {
        const userUrls = await db.userTimetableURL.findMany({
            where: { userId: userId },
            select: { url: true }, // Only fetch the url field
        });

        if (userUrls.length === 0) {
            log({ type: TLog.info, text: `No URLs found for user ${userId}` });
            return [];
        }

        // Extract URLs from the result and return them
        return userUrls.map((entry) => entry.url);
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error fetching profile URLs for user ${userId}: ${e.message}`,
            });
        }
        return [];
    }
}

/**
 * Deletes a profile unit URL for a specific user.
 * @param userId The ID of the user whose profile unit URL needs deletion.
 * @param url The URL to delete from the user's profile.
 * @returns A promise that resolves to a boolean indicating the operation's success.
 */
export async function deleteProfileUnitUrl(
    userId: User["id"],
    url: string,
): Promise<boolean> {
    log({ type: TLog.info, text: `Deleting profile URL for user ${userId}` });

    try {
        // Check if the URL exists for the user
        const urlExists = await db.userTimetableURL.findFirst({
            where: { userId: userId, url: url },
        });

        if (!urlExists) throw new Error("URL does not exist for this user");

        // Delete the URL from the database
        await db.userTimetableURL.delete({
            where: { id: urlExists.id },
        });

        log({
            type: TLog.info,
            text: `Profile URL deleted for user ${userId}`,
        });
        return true;
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error deleting profile URL for user ${userId}: ${e.message}`,
            });
        }
        return false;
    }
}
