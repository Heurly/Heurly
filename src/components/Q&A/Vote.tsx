"use client";

import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import React from "react";

type PropsVote = {
    upvotes: number;
    downvotes: number;
    hasVotedUp: boolean;
    hasVotedDown: boolean;
    onClickUpVote: () => void;
    onClickDownVote: () => void;
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
            ...props
        },
        ref,
    ) => {
        return (
            <div className="grid w-20 max-w-24" {...props} ref={ref}>
                <div className="flex flex-col md:flex-row">
                    <ChevronUpCircle
                        size={75}
                        strokeWidth={1}
                        onClick={onClickUpVote}
                        className="cursor-pointer"
                        fill={
                            hasVotedUp ? "hsl(var(--primary))" : "transparent"
                        }
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
                            hasVotedDown ? "hsl(var(--primary))" : "transparent"
                        }
                    />
                    <div className="flex h-full w-full items-center justify-center">
                        {downvotes}
                    </div>
                </div>
            </div>
        );
    },
);

Vote.displayName = "Vote";

export default Vote;
