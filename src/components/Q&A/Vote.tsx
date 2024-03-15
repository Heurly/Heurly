"use client";

import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import React from "react";
import cn from "classnames";

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
            // <Link href="#" className={cn(className)} {...props}>
            <div
                className={cn(
                    "grid h-full max-h-24 gap-1 md:grid-cols-2",
                    className,
                )}
                ref={ref}
                {...props}
            >
                <ChevronUpCircle
                    size="2.5rem"
                    strokeWidth={1}
                    onClick={async (e) => {
                        e.stopPropagation();
                        await handleUpVote(e);
                    }}
                    className="max-w-10 cursor-pointer place-self-center"
                    fill={upVote ? "hsl(var(--primary))" : "white"}
                />
                <p className="place-self-center md:col-start-2 md:self-center md:justify-self-start">
                    {upvotes}
                </p>

                <ChevronDownCircle
                    size="2.5rem"
                    strokeWidth={1}
                    onClick={async (e) => {
                        e.stopPropagation();
                        await handleDownVote(e);
                    }}
                    className="max-w-10 cursor-pointer place-self-center"
                    fill={downVote ? "hsl(var(--primary))" : "transparent"}
                />
                <p
                    className={cn(
                        "md:col-start-2 md:self-center md:justify-self-start",
                        "row-start-3 place-self-center md:row-start-[unset]",
                    )}
                >
                    {downvotes}
                </p>
            </div>
            // </Link>
        );
    },
);

Vote.displayName = "Vote";

export default Vote;
