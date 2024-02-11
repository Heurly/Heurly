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

export { getProfileUnits }