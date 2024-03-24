"use server";

import { db } from "@/server/db";
import { Notes, Prisma } from "@prisma/client";
import { getServerAuthSession } from "./auth";

export async function createNotes(title: string) {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    return await db.notes.create({
        data: {
            userId: session.user.id,
            title: title,
            content: Prisma.JsonNull,
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

export async function getNotes(noteId: number): Promise<Notes | null> {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    const notes = await db.notes.findUnique({
        where: {
            id: noteId,
            userId: session.user.id,
        },
    });

    return notes ?? null;
}

export async function getNoteContent(noteId: number): Promise<Notes | null> {
    const notes = await db.notes.findUnique({
        where: {
            id: noteId,
        },
    });

    return notes ?? null;
}

export async function getAllNotes(): Promise<Notes[] | null> {
    const session = await getServerAuthSession();
    if (session?.user?.id === undefined) return null;

    const notes = await db.notes.findMany({
        where: {
            userId: session.user.id,
        },
    });

    return notes ?? null;
}
