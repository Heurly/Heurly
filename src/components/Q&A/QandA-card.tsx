"use client";

import { Card } from "../ui/card";
import DateFormatted from "../ui/date-formatted";
import Vote from "@/components/Q&A/Vote";
import cn from "classnames";
import React, { useState } from "react";
import { buttonVariants } from "../ui/button";

type PropsQuestionCard = {
    type: "question" | "answer";
    title: string;
    text: string;
    date: Date;
    author: string;
    upvotes: number;
    downvotes: number;
    hasVotedDown?: boolean;
    hasVotedUp?: boolean;
    className?: string;
};

const QandACard = React.forwardRef<HTMLDivElement, PropsQuestionCard>(
    (
        {
            className,
            type,
            title,
            text,
            date,
            author,
            upvotes,
            downvotes,
            hasVotedDown,
            hasVotedUp,
            ...props
        },
        ref,
    ) => {
        const [seeMore, setSeeMore] = useState(false);

        function handleSeeMore() {
            setSeeMore(!seeMore);
        }
        function handleUpVote() {
            console.log("upvote");
        }

        function handleDownVote() {
            console.log("downvote");
        }
        return (
            <Card
                ref={ref}
                className={cn(
                    className,
                    "flex w-11/12 justify-between bg-white p-10 py-16 md:gap-x-5",
                    { "w-full": type == "question" },
                )}
                {...props}
            >
                <div className="grid gap-y-3">
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">
                                {type == "question" ? "Question" : "Réponse"}
                                {" : "}
                                {title}
                            </h2>
                            <p className=" text-sm">
                                {author} le{" "}
                                <DateFormatted format="dd/MM/yyyy à hh:mm:ss">
                                    {date}
                                </DateFormatted>
                            </p>
                        </div>
                    </div>
                    <p>
                        {text.length > 200 && !seeMore ? (
                            <>{text.substring(0, 200)}...</>
                        ) : (
                            text
                        )}
                        {text.length > 200 && (
                            <button
                                className={buttonVariants({
                                    variant: "link",
                                })}
                                onClick={handleSeeMore}
                            >
                                {!seeMore ? "Voir plus" : "Voir moins"}
                            </button>
                        )}
                    </p>
                </div>
                <Vote
                    upvotes={upvotes}
                    onClickUpVote={handleUpVote}
                    downvotes={downvotes}
                    onClickDownVote={handleDownVote}
                    hasVotedDown={hasVotedDown ?? false}
                    hasVotedUp={hasVotedUp ?? false}
                />
            </Card>
        );
    },
);

QandACard.displayName = "QandACard";

export default QandACard;
