import { log, TLog } from "@/logger/logger";
import { db } from "./db";

export async function getRights(nbRole = 10) {
    let roles = null;

    try {
        roles = await db.right.findMany({
            take: nbRole,
            select: {
                role: true,
                feature: true,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error fetching roles: ${e.message}`,
            });
        }
    }
    return roles;
}
