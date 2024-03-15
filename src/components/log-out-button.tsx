"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogOutButton() {
    return (
        <>
            <LogOut onClick={() => signOut({ callbackUrl: "/login" })} />
        </>
    );
}
