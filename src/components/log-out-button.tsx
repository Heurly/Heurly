"use client";
import cn from "classnames";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { forwardRef } from "react";

type PropsLogOutButton = {
    className?: string;
};

const LogOutButton = forwardRef<SVGSVGElement, PropsLogOutButton>(
    (props, ref) => {
        return (
            <LogOut
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={cn(props.className)}
                ref={ref}
            />
        );
    },
);

LogOutButton.displayName = "LogOutButton";

export default LogOutButton;
