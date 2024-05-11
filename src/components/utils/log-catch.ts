import { TLog, log } from "@/logger/logger";

export default function LogCatch(e: Error | string) {
    if (e instanceof Error) {
        log({ type: TLog.error, text: `❌ ${e.message}` });
    }
    if (typeof e === "string") {
        log({ type: TLog.error, text: e });
    }
}
