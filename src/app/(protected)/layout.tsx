import { getServerAuthSession } from "@/server/auth";
import type { DefaultSession } from "next-auth";
import { RedirectType, redirect } from "next/navigation";
import type { ReactElement } from "react";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<ReactElement> {
    const session: DefaultSession | null = await getServerAuthSession();
    if (!session) redirect("/login", RedirectType.replace);
    return <>{children}</>;
}
