"use client";

import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";

type PropsVote = {
    upvotes: number;
    downvotes: number;
    hasVotedUp: boolean;
    hasVotedDown: boolean;
    onClickUpVote: () => void;
    onClickDownVote: () => void;
};

export default function Vote({
    upvotes,
    onClickUpVote,
    downvotes,
    onClickDownVote,
    hasVotedDown,
    hasVotedUp,
}: PropsVote) {
    return (
        <div className="grid max-h-20 w-20 max-w-24">
            <div className="flex flex-col md:flex-row">
                <ChevronUpCircle
                    size={75}
                    strokeWidth={1}
                    onClick={onClickUpVote}
                    className="cursor-pointer"
                    fill={hasVotedUp ? "hsl(var(--primary))" : "transparent"}
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
                    fill={hasVotedDown ? "hsl(var(--primary))" : "transparent"}
                />
                <div className="flex h-full w-full items-center justify-center">
                    {downvotes}
                </div>
            </div>
        </div>
    );
}
