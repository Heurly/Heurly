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

    let resCreateEvent;

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
export async function getEvents(nbEvents = 10, userId?: User["id"]) {
    log({ type: TLog.info, text: "Fetching events" });

    const resCheckUserId = UserModel.shape.id.safeParse(userId);
    if (!resCheckUserId.success) throw new Error("Invalid user id");

    const resCheckNb = z.number().safeParse(nbEvents);
    if (!resCheckNb.success) throw new Error("Invalid number of questions");

    try {
        const events = await db.event.findMany({
            take: nbEvents,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
                EventUser: {
                    where: {
                        userId: userId,
                    },
                },
                _count: {
                    select: { EventUser: true },
                },
            },
        });

        // insert the number of upvotes and downvotes for each question
        const resEvents = events.map((event) => {
            const nbParticipated = event.EventUser.filter(
                (vote) => vote.vote == 1,
            ).length;
            return { ...events, nbParticipated };
        });

        return resEvents;
    } catch (e) {
        throw new Error("An error occured while fetching the questions");
    }
}
