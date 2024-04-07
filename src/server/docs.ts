"use server";
import { Docs, User } from "@prisma/client";
import { db } from "./db";
import { DocsModel, UserModel } from "prisma/zod";
import { bucket } from "./bucket";
import { TLog, log } from "@/logger/logger";
import { revalidatePath } from "next/cache";

/**
 *
 * @returns {Promise<Docs[]>} A promise that resolves to an array of docs
 */
export async function getDocs(): Promise<Docs[]> {
    try {
        const resDBDocs = await db.docs.findMany();
        return resDBDocs;
    } catch (e) {
        throw new Error("Error: Could not get docs.");
    }
}

export async function getDocById(docId: string): Promise<Docs> {
    try {
        const resDBDoc = await db.docs.findUnique({
            where: {
                id: docId,
            },
        });
        return resDBDoc!;
    } catch (e) {
        throw new Error("Error: Could not get docs.");
    }
}

export async function getFile(doc: Docs) {
    return bucket.getFile(doc);
}

/**
 *
 * @param userId The id of the user to get docs for
 * @returns {Promise<Docs[]>} A promise that resolves to an array of docs
 */
export async function getDocsByUser(userId: User["id"]): Promise<Docs[]> {
    // zod verification for user id
    const resCheckUserId = UserModel.shape.id.safeParse(userId);

    if (!resCheckUserId.success) throw new Error("Error: Invalid user id.");

    try {
        const resDBUserDocs = await db.docs.findMany({
            where: {
                userId: userId,
            },
        });
        return resDBUserDocs;
    } catch (e) {
        throw new Error("Error: Could not get docs by user.");
    }
}

/**
 *
 * @param docId The id of the doc to delete
 * @param userId The id of the user who owns the doc
 * @returns {Promise<{success: boolean, data: Docs}>} A promise that resolves to an object with a success boolean and the deleted doc
 */
export async function deleteUserDoc(docId: Docs["id"], userId: User["id"]) {
    // zod verification for user id
    const resCheckUserId = UserModel.shape.id.safeParse(userId);

    if (!resCheckUserId.success) throw new Error("Error: Invalid user id.");

    // zod verification for doc id
    const resCheckDocId = DocsModel.shape.id.safeParse(docId);

    if (!resCheckDocId.success) throw new Error("Error: Invalid doc id.");

    try {
        // get the id of the doc
        const resDBDoc = await db.docs.findUnique({
            where: {
                id: docId,
            },
        });

        if (!resDBDoc?.url) return;

        // delete the doc in the cloud storage
        const resDeleteFromBucket = await bucket.deleteFileByName(
            "heurly_" + resDBDoc.title,
        );
        if (!resDeleteFromBucket.success)
            throw new Error("Error: Could not delete doc. (bucket error)");

        // delete the doc in the db
        const resDBDeleteDoc = await db.docs.delete({
            where: {
                id: docId,
                userId: userId,
            },
        });
        if (!resDBDeleteDoc)
            throw new Error("Error: Could not delete doc. (db error)");

        return {
            success: true,
            data: resDBDeleteDoc,
        };
    } catch (e) {
        log({ type: TLog.error, text: `${e as string}` });
    }
}

/**
 *
 * @param docId The id of the doc to delete
 * @returns
 */
export async function deleteDoc(docId: Docs["id"]) {
    // zod verification for doc id
    const resCheckDocId = DocsModel.shape.id.safeParse(docId);

    if (!resCheckDocId.success) throw new Error("Error: Invalid doc id.");

    try {
        // get the id of the doc
        const resDBDoc = await db.docs.findUnique({
            where: {
                id: docId,
            },
        });

        if (!resDBDoc?.url) return;

        // delete the doc in the cloud storage
        const resDeleteFromBucket = await bucket.deleteFileByName(
            "heurly_" + resDBDoc.title,
        );
        if (!resDeleteFromBucket.success)
            throw new Error("Error: Could not delete doc. (bucket error)");

        // delete the doc in the db
        const resDBDeleteDoc = await db.docs.delete({
            where: {
                id: docId,
            },
        });
        if (!resDBDeleteDoc)
            throw new Error("Error: Could not delete doc. (db error)");

        revalidatePath("/");
        return {
            success: true,
            data: resDBDeleteDoc,
        };
    } catch (e) {
        log({ type: TLog.error, text: `${e as string}` });
    }
}
