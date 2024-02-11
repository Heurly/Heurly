"use server"
import { User } from "@prisma/client";
import { db } from "./db";

async function getProfileUnits(userId: User["id"]) {
    const res = await db.userUnit.findMany({
        where: {
            userId: userId
        }
    })
    const units = res.map((u) => u.unitId);
    return units;
}

async function addProfileUnit(userId: User["id"], unitId: number) {
    const res = await db.userUnit.create({
        data: {
            userId: userId,
            unitId: unitId
        }
    })
    return res;
}

export { getProfileUnits, addProfileUnit }