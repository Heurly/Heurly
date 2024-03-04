"use client";

import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import React from "react";
import cn from "classnames";
import Link from "next/link";

type PropsVote = {
    upvotes: number;
    downvotes: number;
    hasVotedUp: boolean;
    hasVotedDown: boolean;
    onClickUpVote: (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    ) => Promise<void>;
    onClickDownVote: (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    ) => Promise<void>;
    className?: string;
};

const Vote = React.forwardRef<HTMLDivElement, PropsVote>(
    (
        {
            upvotes,
            downvotes,
            hasVotedUp,
            hasVotedDown,
            onClickUpVote,
            onClickDownVote,
            className,
            ...props
        },
        ref,
    ) => {
        return (
            <Link href="#">
                <div
                    className={cn("grid w-20 max-w-24", className)}
                    {...props}
                    ref={ref}
                >
                    <div className="flex flex-col md:flex-row">
                        <ChevronUpCircle
                            size={75}
                            strokeWidth={1}
                            onClick={onClickUpVote}
                            className="cursor-pointer"
                            fill={hasVotedUp ? "hsl(var(--primary))" : "white"}
                        />
                        <div className="flex h-full w-full items-center justify-center">
                            {upvotes}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row">
                        <ChevronDownCircle
                            size={75}
                            strokeWidth={1}
                            onClick={onClickDownVote}
                            className="cursor-pointer"
                            fill={
                                hasVotedDown
                                    ? "hsl(var(--primary))"
                                    : "transparent"
                            }
                        />
                        <div className="flex h-full w-full items-center justify-center">
                            {downvotes}
                        </div>
                    </div>
                </div>
            </Link>
        );
    },
);

Vote.displayName = "Vote";

export default Vote;
