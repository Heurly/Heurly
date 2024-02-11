"use server"
import { db } from "@/server/db";

export async function getFieldsByLevel(level: number) {

    const fields = await db.unit.findMany({
        where: {
            level: level
        }
    });

    return fields;
}