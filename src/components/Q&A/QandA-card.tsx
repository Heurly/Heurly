"use client";

import { Card, CardContent } from "../ui/card";
import DateFormatted from "../ui/date-formatted";
import Vote from "@/components/Q&A/Vote";
import cn from "classnames";
import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import { HelpCircle, Reply } from "lucide-react";

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
                className={cn(className, "w-11/12 px-10 py-16 ", {
                    "w-full": type == "question",
                })}
                {...props}
            >
                <CardContent className="flex justify-between md:gap-x-5">
                    <div className="grid gap-y-3">
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <div className="flex gap-3">
                                    {type == "question" ? (
                                        <HelpCircle />
                                    ) : (
                                        <Reply />
                                    )}
                                    <h2 className="text-xl font-bold">
                                        {title}
                                    </h2>
                                </div>
                                <p className=" text-sm">
                                    {author} le{" "}
                                    <DateFormatted format="dd/MM/yyyy à hh:mm:ss">
                                        {date}
                                    </DateFormatted>
                                </p>
                            </div>
                        </div>
                        <p>
                            {
                                // If the text length is more than 200 and seeMore is false, show a truncated version of the text
                                text.length > 200 && !seeMore ? (
                                    <>{text.substring(0, 200)}...</>
                                ) : (
                                    // Otherwise, show the full text
                                    text
                                )
                            }
                            {
                                // If the text length is more than 200, show a button to toggle the text display
                                text.length > 200 && (
                                    <button
                                        className={buttonVariants({
                                            variant: "link",
                                        })}
                                        onClick={handleSeeMore}
                                    >
                                        {!seeMore ? "Voir plus" : "Voir moins"}
                                    </button>
                                )
                            }
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
                </CardContent>
            </Card>
        );
    },
);

QandACard.displayName = "QandACard";

export default QandACard;
