"use server";
import isAllowedTo from "@/components/utils/is-allowed-to";
import { TLog, log } from "@/logger/logger";
import type { Feature, Role } from "@prisma/client";
import { getServerAuthSession } from "./auth";
import { db } from "./db";

export async function getRights(nbRole = 10) {
    const session = await getServerAuthSession();

    if (!session?.user?.id) throw new Error("User not found");

    // verify if the user is allowed to fetch the roles
    const isAllowedToFetchRoles = await isAllowedTo(
        "show_right",
        session.user.id,
    );
    if (!isAllowedToFetchRoles)
        throw new Error("User is not allowed to fetch roles");

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

export async function addRoleFeature(
    roleId: Role["id"],
    featureId: Feature["id"],
) {
    log({
        type: TLog.info,
        text: `Adding feature ${featureId} to role ${roleId}`,
    });

    // verify if the user is allowed to add a feature to a role
    const session = await getServerAuthSession();

    if (!session?.user?.id) throw new Error("User not found");

    const isAllowedToAddRoleFeature = await isAllowedTo(
        "edit_right",
        session.user.id,
    );

    if (!isAllowedToAddRoleFeature)
        throw new Error("User is not allowed to add a feature to a role");

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
    }
    return {
        message: "An error occured",
        success: false,
    };
}

export async function deleteRight(
    roleId: Role["id"],
    featureId: Feature["id"],
) {
    log({
        type: TLog.info,
        text: `Deleting feature ${roleId} from role ${featureId}`,
    });

    // verify if the user is allowed to delete a feature from a role
    const session = await getServerAuthSession();

    if (!session?.user?.id) throw new Error("User not found");

    const isAllowedToDeleteRoleFeature = await isAllowedTo(
        "edit_right",
        session.user.id,
    );

    if (!isAllowedToDeleteRoleFeature)
        throw new Error("User is not allowed to delete a feature from a role");

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
