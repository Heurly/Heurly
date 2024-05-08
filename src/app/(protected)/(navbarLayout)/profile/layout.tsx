"use client";
import { TLog, log } from "@/logger/logger";
import { SessionProvider } from "next-auth/react";

export default function LayoutTimetable({
    children,
}: {
    children: React.ReactNode;
}) {
    log({ type: TLog.info, text: "Rendering Profile page" });
    return <SessionProvider>{children}</SessionProvider>;
}
