"use client";
import React from "react";
import "@/styles/globals.css";
import { Card } from "@/components/ui/card";
import { SessionProvider } from "next-auth/react";

export default function NavBarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <Card className="h-full w-full p-6">{children}</Card>
        </SessionProvider>
    );
}
