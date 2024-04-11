"use server";

import { log, TLog } from "@/logger/logger";
import { db } from "./db";

export async function getFeatures(nbFeatures = 10) {
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
