"use server";
import { db } from "@/server/db";
import { TLog, log } from "@/logger/logger";
import type { Event, User } from "@prisma/client";
import { dataCreateEventSchema } from "@/types/schema/form-create-event";
import { z } from "zod";
import { UserModel } from "prisma/zod";
import { EventModel } from "prisma/zod/event";

/**
 *
 * @param data The data to create the event
 * @returns {Promise<{success: boolean, data: Event}>} A promise that resolves to an object with a success boolean and the created question
 */
export async function handleFormCreateEvent(
    data: z.infer<typeof dataCreateEventSchema>,
): Promise<{ success: boolean; data: Event }> {
    log({ type: TLog.info, text: "Handling form create event" });
    // Validate the data
    const resParseRawData = dataCreateEventSchema.safeParse(data);
    if (!resParseRawData.success) {
        throw resParseRawData.error;
    }

    let resCreateEvent = null;

    // Create the question
    try {
        resCreateEvent = await db.event.create({
            data: {
                event: data.event,
                description: data.description,
                userId: data.userId,
                urlImage: data.urlImage,
                location: data.location,
                eventDate: data.eventDate,
            },
        });
    } catch (e) {
        throw new Error("An error occured while creating the question");
    }

    // return the data
    return { success: true, data: resCreateEvent };
}

export async function getEventById(
    eventId: Event["id"],
): Promise<Event | null> {
    log({ type: TLog.info, text: "Fetching question by id" });

    // validate the id
    const resCheckEventID = EventModel.shape.event.safeParse(eventId);
    if (!resCheckEventID.success) {
        throw new Error("Invalid id");
    }

    try {
        const EventById = await db.event.findUnique({
            where: {
                id: eventId,
            },
        });

        return EventById;
    } catch (e) {
        throw new Error("An error occured while fetching the question");
    }
}

/**
 *
 * @param nbEvents the number of questions to fetch
 * @param userId the id of the user, if provided, the function will return the votes of the user
 *
 */
export async function getEvents(nbEvents = 10) {
    log({ type: TLog.info, text: "Fetching events" });

    const resCheckNb = z.number().gt(0).safeParse(nbEvents);
    if (!resCheckNb.success) throw new Error("Invalid number of questions");

    let events = null;
    try {
        events = await db.event.findMany();
    } catch (e) {
        throw new Error("An error occured while fetching events");
    }
    return events;
}
