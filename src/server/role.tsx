import { log, TLog } from "@/logger/logger";
import type { Role } from "@prisma/client";
import { db } from "./db";

export async function getRoles() {
    let roles: Role[] = [];

    try {
        roles = await db.role.findMany({
            take: 10,
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
