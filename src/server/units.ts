"use server"

import { db } from "@/server/db";

export async function getAllUnits(): Promise<{ label: string, code: number }[]> {
    const res = await db.unit.findMany();

    const data = res.map((m) => ({
        label: m.fullName.replaceAll(";", " - "),
        code: m.code,
    }));

    return data

}