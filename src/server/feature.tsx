"use server";

import { log, TLog } from "@/logger/logger";
import { db } from "./db";
import { getServerAuthSession } from "./auth";
import isAllowedTo from "@/components/utils/is-allowed-to";

export async function getFeatures(nbFeatures = 10) {
    const session = await getServerAuthSession();

    if (!session?.user?.id) throw new Error("User not found");

    // verify if the user is allowed to create notes
    const isAllowedToCreateNote = await isAllowedTo(
        "show_feature",
        session.user.id,
    );

    if (!isAllowedToCreateNote)
        throw new Error("User is not allowed to create notes");

    let resFetchFeatures = null;
    try {
        resFetchFeatures = await db.feature.findMany({
            take: nbFeatures,
        });
    } catch (e) {
        if (e instanceof Error) {
            log({
                type: TLog.error,
                text: e.message,
            });
        }
    }
    return resFetchFeatures;
}
