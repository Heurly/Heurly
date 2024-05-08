"use client";
import type React from "react";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function NavBarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<div className="h-full w-full px-5">{children}</div>
		</SessionProvider>
	);
}
