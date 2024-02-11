"use server"
import { Unit, User, UserUnit } from "@prisma/client";
import { db } from "./db";
import { getUnitByCode } from "./units";

async function getProfileUnits(userId: User["id"]) {
    const res = await db.userUnit.findMany({
        where: {
            userId: userId
        }
    })
    const units = res.map((u) => u.unitId);
    return units;
}

async function addProfileUnit(userId: UserUnit["userId"], unitCode: Unit["code"]) {

    const unitId = await getUnitByCode(unitCode);

    if (unitId === null) return null;

    const res = await db.userUnit.create({
        data: {
            userId: userId,
            unitId: unitId.id
        }
    })
    return res;
}

export { getProfileUnits, addProfileUnit }