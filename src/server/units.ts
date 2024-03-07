"use server";

import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import type { Unit } from "@prisma/client";

async function getAllUnits(): Promise<{ label: string; code: number }[]> {
    log({ type: TLog.info, text: "Fetching all units" });
    const res = await db.unit.findMany();

    const data = res.map((m) => ({
        label: m.fullName.replaceAll(";", " - "),
        code: m.code,
    }));

    return data;
}

async function getUnitById(unitId: Unit["id"]) {
    log({ type: TLog.info, text: "Fetching unit by id" });
    const res = await db.unit.findUnique({
        where: {
            id: unitId,
        },
    });

    return res;
}

async function getUnitByCode(unitCode: Unit["code"]) {
    log({ type: TLog.info, text: "Fetching unit by code" });
    const res = await db.unit.findUnique({
        where: {
            code: unitCode,
        },
    });

    return res;
}

export { getAllUnits, getUnitById, getUnitByCode };
