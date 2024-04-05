"use server";
import { log, TLog } from "@/logger/logger";
import type { Role, User } from "@prisma/client";
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

export async function updateRole(
    userId: User["id"],
    previousRoleId: Role["id"],
    newRoleId: Role["id"],
) {
    log({
        type: TLog.info,
        text: `Updating role for user id ${userId} from ${previousRoleId} to ${newRoleId}`,
    });

    let previousData = null;
    try {
        previousData = await db.userRole.findFirst({
            where: {
                userId: userId,
                roleId: previousRoleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error when fetching previous role: ${e.message}`,
            });
        }
    }

    if (!previousData) {
        log({
            type: TLog.error,
            text: `Error updating role: No previous role found for user id ${userId} and role id ${previousRoleId}`,
        });
        return;
    }
    let updatedData = null;
    try {
        updatedData = await db.userRole.update({
            where: {
                id: previousData.id,
            },
            data: {
                roleId: newRoleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error updating role: ${e.message}`,
            });
        }
    }
    if (!updatedData) {
        log({
            type: TLog.error,
            text: `Error updating role: No data updated for user id ${userId} and role id ${previousRoleId}`,
        });
    }
}
