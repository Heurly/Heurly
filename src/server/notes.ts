"use server";

import isAllowedTo from "@/components/utils/is-allowed-to";
import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import type { CourseDate } from "@/types/courses";
import { type Notes, Prisma, type User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "./auth";

export async function createNotes(title: string, courseDate?: CourseDate) {
    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToCreateNote = await isAllowedTo(
        "create_note",
        session.user.id,
    );

    // verify if the user is allowed to create notes
    if (!isAllowedToCreateNote)
        throw new Error("You are not allowed to create notes");

    let noteCreated = null;

    try {
        noteCreated = await db.notes.create({
            data: {
                userId: session.user.id,
                title: title,
                content: Prisma.JsonNull,
                courseId: courseDate?.courseId ?? undefined,
                courseDate: courseDate?.courseDate ?? undefined,
            },
        });
    } catch (e) {
        throw new Error("An error occured while trying to create notes.");
    }
    return noteCreated;
}

export async function updateNotes(notes: Notes) {
    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToEditNote = await isAllowedTo("edit_note", session.user.id);

    // verify if the user is allowed to edit notes
    if (!isAllowedToEditNote)
        throw new Error("You are not allowed to edit notes");

    let updatedNotes = null;

    try {
        updatedNotes = await db.notes.update({
            where: {
                id: notes.id,
                userId: session.user.id,
            },
            data: {
                ...notes,
                content: notes.content ?? Prisma.JsonNull,
            },
        });
    } catch (e) {
        throw new Error("An error occured while trying to update notes.");
    }

    return updatedNotes;
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
    }
    return {
        success: r !== null,
        message: message,
    };
}

export async function updateNotesTitle(
    id: string,
    title: string,
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
                title: title,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/");
    } catch (e) {
        log({ type: TLog.error, text: "Could not save editor title to db." });
        message = `Could not save editor title to db: ${(e as string) ?? ""}`;
        throw e;
    }
    return {
        success: r !== null,
        message: message,
    };
}

export async function getCourseDateNotesPublic(
    courseDate: CourseDate,
): Promise<Notes[] | null> {
    let notesGot = null;

    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToSeeNotes = await isAllowedTo("show_note", session.user.id);

    // verify if the user is allowed to see notes
    if (!isAllowedToSeeNotes)
        throw new Error("You are not allowed to see notes");

    // date to utc (plus offset)
    const courseDateUTC = new Date(
        courseDate.courseDate.getTime() -
            courseDate.courseDate.getTimezoneOffset() * 60000,
    );

    try {
        notesGot = await db.notes.findMany({
            where: {
                courseId: courseDate.courseId,
                courseDate: courseDateUTC,
                public: true,
                NOT: {
                    userId: session.user.id,
                },
            },
        });
    } catch (e) {
        throw new Error(
            "An error occured while trying to get notes from the db.",
        );
    }

    return notesGot;
}

export async function getCourseDateNotesMy(
    courseDate: CourseDate,
): Promise<Notes[] | null> {
    let notesGot = null;

    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToSeeNotes = await isAllowedTo("show_note", session.user.id);

    // verify if the user is allowed to see notes
    if (!isAllowedToSeeNotes)
        throw new Error("You are not allowed to see notes");

    // date to utc (plus offset)
    const courseDateUTC = new Date(
        courseDate.courseDate.getTime() -
            courseDate.courseDate.getTimezoneOffset() * 60000,
    );

    try {
        notesGot = await db.notes.findMany({
            where: {
                courseId: courseDate.courseId,
                courseDate: courseDateUTC,
                userId: session.user.id,
            },
        });
    } catch (e) {
        throw new Error(
            "An error occured while trying to get notes from the db.",
        );
    }

    return notesGot;
}

export async function getNotes(noteId: Notes["id"]): Promise<Notes | null> {
    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToSeeNotes = await isAllowedTo("show_note", session.user.id);

    // verify if the user is allowed to see notes
    if (!isAllowedToSeeNotes)
        throw new Error("You are not allowed to see notes");

    try {
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

export async function getNoteContent(
    noteId: Notes["id"],
): Promise<Notes | null> {
    let notes = null;

    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToSeeNotes = await isAllowedTo("show_note", session.user.id);

    // verify if the user is allowed to see notes
    if (!isAllowedToSeeNotes)
        throw new Error("You are not allowed to see notes");

    try {
        notes = await db.notes.findUnique({
            where: {
                id: noteId,
            },
        });
    } catch (e) {
        throw new Error(
            "An error occured while trying to get notes from the db.",
        );
    }

    return notes;
}

export async function getAllNotes(): Promise<Notes[] | null> {
    let notes = null;

    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToSeeNotes = await isAllowedTo("show_note", session.user.id);
    // verify if the user is allowed to see notes
    if (!isAllowedToSeeNotes)
        throw new Error("You are not allowed to see notes");

    try {
        notes = await db.notes.findMany({
            where: {
                public: true,
            },
        });
    } catch (e) {
        throw new Error(
            "An error occured while trying to get notes from the db.",
        );
    }

    return notes;
}

export async function deleteNotes(noteId: Notes["id"]) {
    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) return null;

    const isAllowedToDeleteNote = await isAllowedTo(
        "delete_note",
        session.user.id,
    );

    // verify if the user is allowed to delete notes
    if (!isAllowedToDeleteNote)
        throw new Error("You are not allowed to delete notes");

    let deletedNotes = null;

    try {
        deletedNotes = await db.notes.delete({
            where: {
                id: noteId,
                userId: session.user.id,
            },
        });
    } catch (e) {
        throw new Error("An error occured while trying to delete notes.");
    }

    revalidatePath("/");

    return deletedNotes;
}

export async function setNoteVisibility(notesId: Notes["id"], value: boolean) {
    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) return null;

    const isAllowedToEditNote = await isAllowedTo("edit_note", session.user.id);

    // verify if the user is allowed to edit notes
    if (!isAllowedToEditNote)
        throw new Error("You are not allowed to edit notes");

    revalidatePath("/");

    let updatedNotes = null;
    try {
        updatedNotes = await db.notes.update({
            where: {
                id: notesId,
                userId: session.user.id,
            },
            data: {
                public: value,
            },
        });
    } catch (e) {
        throw new Error("An error occured while trying to update notes.");
    }

    return updatedNotes;
}

export async function getAllUserNotes(userId: User["id"]) {
    const session = await getServerAuthSession();

    if (session?.user?.id === undefined) throw new Error("User not found");

    const isAllowedToSeeNotes = await isAllowedTo("show_note", session.user.id);
    // verify if the user is allowed to see notes
    if (!isAllowedToSeeNotes)
        throw new Error("You are not allowed to see notes");

    let notesGot = null;
    try {
        notesGot = await db.notes.findMany({
            where: {
                userId: userId,
            },
        });
    } catch (e) {
        throw new Error(
            "An error occured while trying to get notes from the db.",
        );
    }

    return notesGot;
}
