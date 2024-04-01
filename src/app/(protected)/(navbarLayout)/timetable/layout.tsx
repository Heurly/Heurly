import { TLog, log } from "@/logger/logger";

export default function LayoutTimetable({
    children,
}: {
    children: React.ReactNode;
}) {
    log({ type: TLog.info, text: "Rendering timetable page" });
    return <>{children}</>;
}
