"use server";

import { db } from "@/server/db";
import { Notes, Prisma } from "@prisma/client";
import { getServerAuthSession } from "./auth";
import { CourseDate } from "@/types/courses";
import { revalidatePath } from "next/cache";
import { TLog, log } from "@/logger/logger";

export async function createNotes(title: string, courseDate?: CourseDate) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    return await db.notes.create({
        data: {
            userId: session.user.id,
            title: title,
            content: Prisma.JsonNull,
            courseId: courseDate?.courseId ?? undefined,
            courseDate: courseDate?.courseDate ?? undefined,
        },
    });
}

export async function saveNotes(notes: Notes) {
    return await db.notes.create({
        data: {
            ...notes,
            content: notes.content ?? Prisma.JsonNull,
        },
    });
}

export async function updateNotes(notes: Notes) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    return await db.notes.update({
        where: {
            id: notes.id,
            userId: session.user.id,
        },
        data: {
            ...notes,
            content: notes.content ?? Prisma.JsonNull,
        },
    });
}

export async function updateNotesContent(
    id: string,
    content: string,
): Promise<{ success: boolean; message: string }> {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined)
        return {
            success: false,
            message: "You don't have the permission to access this data.",
        };

    let r = null;
    let message = "";
    try {
        r = await db.notes.update({
            where: {
                id: id,
                userId: session.user.id,
            },
            data: {
                content:
                    (JSON.parse(content) as Prisma.JsonValue) ??
                    Prisma.JsonNull,
                updatedAt: new Date(),
            },
        });
    } catch (e) {
        log({ type: TLog.error, text: "Could not save editor content to db." });
        message = `Could not save editor content to db: ${(e as string) ?? ""}`;
        throw e;
    } finally {
        return {
            success: r !== null,
            message: message,
        };
    }
}

export async function getCourseDateNotes(
    courseDate: CourseDate,
): Promise<Notes[] | null> {
    const notes = await db.notes.findMany({
        where: {
            courseId: courseDate.courseId,
            courseDate: courseDate.courseDate,
            public: true,
        },
    });

    return notes ?? null;
}

export async function getNotes(noteId: string): Promise<Notes | null> {
    try {
        const session = await getServerAuthSession();
        if (session?.user?.id === undefined) return null;

        const notes = await db.notes.findUnique({
            where: {
                id: noteId,
            },
        });

        return notes ?? null;
    } catch (e) {
        log({
            type: TLog.error,
            text: "An error occured while trying to get notes from the db.",
        });
        return null;
    }
}

export async function getNoteContent(noteId: string): Promise<Notes | null> {
    const notes = await db.notes.findUnique({
        where: {
            id: noteId,
        },
    });

    return notes ?? null;
}

export async function getAllNotes(): Promise<Notes[] | null> {
    const notes = await db.notes.findMany({
        where: {
            public: true,
        },
    });

    return notes ?? null;
}

export async function deleteNotes(id: string) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    const deletion = await db.notes.delete({
        where: {
            id: id,
            userId: session.user.id,
        },
    });
    revalidatePath("/");

    return deletion ?? null;
}

export async function setNoteVisibility(notesId: string, value: boolean) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;
    revalidatePath("/");
    return await db.notes.update({
        where: {
            id: notesId,
            userId: session.user.id,
        },
        data: {
            public: value,
        },
    });
}

export async function getAllUserNotes(userId: string) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    return await db.notes.findMany({
        where: {
            userId: userId,
        },
    });
}
