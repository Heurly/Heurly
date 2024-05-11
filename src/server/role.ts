"use server";
import { TLog, log } from "@/logger/logger";
import type { Feature, Role, User } from "@prisma/client";
import { UserModel } from "prisma/zod";
import { z } from "zod";
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

export async function getUserRoles(userId: User["id"], nbRoles = 10) {
    const checkUserId = UserModel.shape.id.safeParse(userId);
    if (!checkUserId.success) {
        throw new Error("Invalid user id");
    }

    const checkNbRoles = z.number().safeParse(nbRoles);
    if (!checkNbRoles.success) {
        throw new Error("Invalid number of roles");
    }
    let roles = null;

    try {
        roles = await db.userRole.findMany({
            take: nbRoles,
            where: {
                userId: userId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error fetching user roles: ${e.message}`,
            });
        }
    }
    return roles;
}

export async function addUserRole(userId: User["id"], roleId: Role["id"]) {
    // verify the data
    const checkUserId = UserModel.shape.id.safeParse(userId);
    if (!checkUserId.success) {
        throw new Error("Invalid user id");
    }

    const checkRoleId = UserModel.shape.id.safeParse(roleId);
    if (!checkRoleId.success) {
        throw new Error("Invalid role id");
    }

    let userSpecificRole = null;
    try {
        // Check if the user already has the role
        userSpecificRole = await db.userRole.findFirst({
            where: {
                userId: userId,
                roleId: roleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error when retriving the user role: ${e.message}`,
            });
        }
    }
    if (userSpecificRole) throw new Error("User already has this role");
    // Add the role to the user
    let newRole = null;
    try {
        newRole = await db.userRole.create({
            data: {
                userId: userId,
                roleId: roleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error when adding the user role: ${e.message}`,
            });
        }
    }
    return {
        success: true,
        result: newRole,
        message: "Role added to the user",
    };
}

export async function deleteUserRole(userId: User["id"], roleId: Role["id"]) {
    // verify the data
    const checkUserId = UserModel.shape.id.safeParse(userId);
    if (!checkUserId.success) {
        throw new Error("Invalid user id");
    }

    const checkRoleId = UserModel.shape.id.safeParse(roleId);
    if (!checkRoleId.success) {
        throw new Error("Invalid role id");
    }

    let userSpecificRole = null;
    try {
        // Check if the user already has the role
        userSpecificRole = await db.userRole.findFirst({
            where: {
                userId: userId,
                roleId: roleId,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error when retriving the user role: ${e.message}`,
            });
        }
    }
    if (!userSpecificRole) throw new Error("User does not have this role");

    let removedRole = null;
    try {
        removedRole = await db.userRole.delete({
            where: {
                id: userSpecificRole.id,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: `Error when removing the user role: ${e.message}`,
            });
        }
    }
    return {
        success: true,
        result: removedRole,
        message: "Role removed from the user",
    };
}

export type RoleWithFeatures = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    features: Feature[];
};

//
export async function getRolesFeaturesByRole(
    nbRole = 10,
): Promise<RoleWithFeatures[]> {
    const rolesWithFeatures: RoleWithFeatures[] = [];

    try {
        const roles = await db.role.findMany({
            take: nbRole,
            include: {
                Right: {
                    include: {
                        feature: true,
                    },
                },
            },
        });

        if (roles.length === 0) throw new Error("No roles found");

        for (const role of roles) {
            const features = role.Right.map((right) => right.feature);
            rolesWithFeatures.push({
                id: role.id,
                name: role.name,
                description: role.description,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
                features: features,
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: "Can't retrieve roles and features",
            });
        }
    }

    return rolesWithFeatures;
}
