import { TLog, log } from "@/logger/logger";

export default function handleCatch(e: Error | string) {
    if (typeof e === "string") {
        log({
            type: TLog.info,
            text: e,
        });
    } else if (e instanceof Error) {
        log({
            type: TLog.error,
            text: e.message,
        });
    }
}
