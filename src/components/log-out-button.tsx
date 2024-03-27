"use client";
import React, { forwardRef } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import cn from "classnames";

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
