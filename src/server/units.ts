"use server"

import { db } from "@/server/db";
import type { Unit } from "@prisma/client";

async function getAllUnits(): Promise<{ label: string, code: number }[]> {
    const res = await db.unit.findMany();

    const data = res.map((m) => ({
        label: m.fullName.replaceAll(";", " - "),
        code: m.code,
    }));

    return data

}

async function getUnitById(unitId: Unit["id"]) {
    const res = await db.unit.findUnique({
        where: {
            id: unitId
        }
    })

    return res;
}

async function getUnitByCode(unitCode: Unit["code"]) {
    const res = await db.unit.findUnique({
        where: {
            code: unitCode
        }
    })

    return res;
}

export { getAllUnits, getUnitById, getUnitByCode }