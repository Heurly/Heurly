"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import cn from "classnames";

type PropsLogOutButton = {
    className?: string;
};

const LogOutButton = React.forwardRef<HTMLButtonElement, PropsLogOutButton>(
    ({ className }, ref) => {
        return (
            <button ref={ref} className={cn(className)}>
                <LogOut onClick={() => signOut({ callbackUrl: "/login" })} />
            </button>
        );
    },
);

LogOutButton.displayName = "LogOutButton";

export default LogOutButton;
