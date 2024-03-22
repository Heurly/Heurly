"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import cn from "classnames";

type PropsLogOutButton = {
    className?: string;
};

const LogOutButton = React.forwardRef<
    SVGSVGElement | undefined,
    PropsLogOutButton
>((props) => {
    return (
        <LogOut
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(props.className)}
        />
    );
});

LogOutButton.displayName = "LogOutButton";

export default LogOutButton;
