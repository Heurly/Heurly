import React from "react";
import "@/styles/globals.css";
import { Card } from "@/components/ui/card";

export default function NavBarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Card className="h-full w-full p-6">{children}</Card>;
}
