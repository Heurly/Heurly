import { db } from "@/server/db";
import { User } from "@prisma/client";
import LogCatch from "./log-catch";

type TRightName =
    | "show_timetable"
    | "edit_timetable"
    | "show_docs"
    | "edit_docs"
    | "show_note"
    | "edit_note"
    | "create_note"
    | "delete_note"
    | "show_revision"
    | "show_event"
    | "show_qanda"
    | "edit_qanda"
    | "show_profile"
    | "edit_profile"
    | "show_admin"
    | "show_feature"
    | "show_right"
    | "edit_right";

export default async function isAllowedTo(
    rightName: TRightName,
    userId: User["id"],
) {
    // Find the feature
    let feature;
    try {
        feature = await db.feature.findFirst({
            where: {
                name: rightName,
            },
        });
    } catch (e) {
        LogCatch(e as Error);
        throw new Error("Error finding the feature");
    }

    if (!feature) {
        return {
            success: false,
            result: null,
            message: "This feature does not exist",
        };
    }

    // Find if the user has the role that has the feature
    let userHasRoleWithFeature = [];
    try {
        userHasRoleWithFeature = await db.userRole.findMany({
            where: {
                userId: userId,
                role: {
                    Right: {
                        some: {
                            featureId: feature.id,
                        },
                    },
                },
            },
        });
    } catch (e) {
        LogCatch(e as Error);
        throw new Error("Error finding the user's role with the feature");
    }

    return {
        success: true,
        result: userHasRoleWithFeature.length > 0,
        message:
            userHasRoleWithFeature.length > 0
                ? "User has the required role and feature"
                : "User does not have the required role and feature",
    };
}
