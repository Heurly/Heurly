import * as z from "zod";

export enum TLog {
    info = 0,
    error = 1,
    warning = 2,
}

const logSchema = z.object({
    type: z.string().refine((x) => x in TLog, { message: "Invalid log type" }),
    text: z.string().max(1000),
});

export function log({ type, text }: { type: TLog; text: string }) {
    logSchema.parse({ type: TLog[type], text });
    console.log(`${TLog[type]}: ${text}`);
}

export function loginfo(text: string) {
    log({ type: TLog.info, text: text });
}
