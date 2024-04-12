"use server";
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

export async function addRoleFeature(roleId: string, featureId: string) {
    log({
        type: TLog.info,
        text: `Adding feature ${featureId} to role ${roleId}`,
    });
    // verify if the role already have the feature
    let resGetRight = null;
    try {
        resGetRight = await db.right.findFirst({
            where: {
                featureId: featureId,
                roleId: roleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: e.message,
            });
        }
    }

    if (resGetRight !== null) throw new Error("Right already applyed");

    let resAddRoleFeature = null;
    try {
        resAddRoleFeature = await db.right.create({
            data: {
                featureId: featureId,
                roleId: roleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: e.message,
            });
        }
    }
    if (resAddRoleFeature) {
        return {
            message: "Right applyed",
            success: true,
        };
    } else {
        return {
            message: "An error occured",
            success: false,
        };
    }
}

export async function deleteRight(roleId: string, featureId: string) {
    log({
        type: TLog.info,
        text: `Deleting feature ${roleId} from role ${featureId}`,
    });

    let resGetRight = null;
    try {
        resGetRight = await db.right.findFirst({
            where: {
                featureId: featureId,
                roleId: roleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: e.message,
            });
        }
    }

    if (resGetRight === null) throw new Error("Right not found");

    try {
        await db.right.delete({
            where: {
                id: resGetRight.id,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: e.message,
            });
        }
    }
    return {
        message: "Right deleted",
        success: true,
    };
}
