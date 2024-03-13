"use server";

import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import type { Unit } from "@prisma/client";

/**
 * Fetch all units
 * @returns {Promise<{label: string, code: number}[]>} A promise that resolves to an array of units
 */
export async function getAllUnits(): Promise<
    { label: string; code: number }[]
> {
    log({ type: TLog.info, text: "Fetching all units" });
    const res = await db.unit.findMany();

    const data = res.map((m) => ({
        label: m.fullName.replaceAll(";", " - "),
        code: m.code,
    }));

    return data;
}

/**
 * Fetch a unit by its id
 * @param unitId The id of the unit
 * @returns {Promise<Unit>} A promise that resolves to a unit
 */
export async function getUnitById(unitId: Unit["id"]): Promise<Unit | null> {
    log({ type: TLog.info, text: "Fetching unit by id" });
    const res = await db.unit.findUnique({
        where: {
            id: unitId,
        },
    });

    return res;
}

/**
 * Fetch a unit by its code
 * @param unitCode The code of the unit
 * @returns {Promise<Unit>} A promise that resolves to a unit
 */
export async function getUnitByCode(
    unitCode: Unit["code"],
): Promise<Unit | null> {
    log({ type: TLog.info, text: "Fetching unit by code" });
    const res = await db.unit.findUnique({
        where: {
            code: unitCode,
        },
    });

    return res;
}
