"use server";

import { db } from "@/server/db";
import { Notes, Prisma } from "@prisma/client";
import { getServerAuthSession } from "./auth";
import { CourseDate } from "@/types/courses";
import { revalidatePath } from "next/cache";

export async function createNotes(title: string, courseDate?: CourseDate) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    return await db.notes.create({
        data: {
            userId: session.user.id,
            title: title,
            content: Prisma.JsonNull,
            courseCode: courseDate?.courseCode ?? undefined,
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

export async function getCourseDateNotes(
    courseDate: CourseDate,
): Promise<Notes[] | null> {
    const notes = await db.notes.findMany({
        where: {
            courseCode: courseDate.courseCode,
            courseDate: courseDate.courseDate,
            public: true,
        },
    });

    return notes ?? null;
}

export async function getNotes(noteId: string): Promise<Notes | null> {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    const notes = await db.notes.findUnique({
        where: {
            id: noteId,
        },
    });

    return notes ?? null;
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
