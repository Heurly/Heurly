"use client";

import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import React from "react";
import cn from "classnames";
import Link from "next/link";

type clickEvent = React.MouseEvent<SVGSVGElement, MouseEvent>;

type PropsVote = {
    upvotes: number;
    downvotes: number;
    hasVotedUp: boolean;
    hasVotedDown: boolean;
    onClickUpVote: (e: clickEvent) => Promise<void>;
    onClickDownVote: (e: clickEvent) => Promise<void>;
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
        const [upVote, setUpVote] = React.useState(hasVotedUp);
        const [downVote, setDownVote] = React.useState(hasVotedDown);

        const handleUpVote = async (e: clickEvent) => {
            setUpVote(!upVote);
            await onClickUpVote(e);
        };

        const handleDownVote = async (e: clickEvent) => {
            setDownVote(!upVote);
            await onClickDownVote(e);
        };

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
                            onClick={async (e) => await handleUpVote(e)}
                            className="cursor-pointer"
                            fill={upVote ? "hsl(var(--primary))" : "white"}
                        />
                        <div className="flex h-full w-full items-center justify-center">
                            {upvotes}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row">
                        <ChevronDownCircle
                            size={75}
                            strokeWidth={1}
                            onClick={async (e) => await handleDownVote(e)}
                            className="cursor-pointer"
                            fill={
                                downVote ? "hsl(var(--primary))" : "transparent"
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
