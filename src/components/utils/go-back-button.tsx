"use client";
import cn from "classnames";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

type PropsGoBackButton = {
    className?: string;
};

const GoBackButton = React.forwardRef<HTMLButtonElement, PropsGoBackButton>(
    ({ className, ...props }, ref) => {
        const router = useRouter();
        return (
            <Button
                size={"icon"}
                onClick={() => router.back()}
                {...props}
                ref={ref}
                className={cn(className)}
            >
                <ChevronLeft
                    size={30}
                    strokeWidth={1}
                    className="-translate-x-0.5"
                />
            </Button>
        );
    },
);

GoBackButton.displayName = "GoBackButton";

export default GoBackButton;
