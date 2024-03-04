"use client";

import { Card, CardContent } from "@/components/ui/card";
import DateFormatted from "@/components/ui/date-formatted";
import Vote from "@/components/Q&A/Vote";
import cn from "classnames";
import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { addVoteToAnswer, addVoteToQuestion } from "@/server/vote";
import { useRouter } from "next/navigation";

type PropsQuestionCard = {
    id: string;
    type: "question" | "answer";
    title?: string;
    text: string;
    date: Date;
    author: User;
    upvotes: number;
    downvotes: number;
    hasVotedDown?: boolean;
    hasVotedUp?: boolean;
    className?: string;
};

const QandACard = React.forwardRef<HTMLDivElement, PropsQuestionCard>(
    (
        {
            id,
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
        const router = useRouter();
        async function handleSeeMore() {
            setSeeMore(!seeMore);
        }
        async function handleUpVote() {
            if (type == "question") {
                await addVoteToQuestion(id, 1);
            }
            if (type == "answer") {
                await addVoteToAnswer(id, 1);
            }
            router.refresh();
        }

        async function handleDownVote() {
            if (type == "question") {
                await addVoteToQuestion(id, 0);
            }
            if (type == "answer") {
                await addVoteToAnswer(id, 0);
            }
            router.refresh();
        }

        if (!author.name) return;

        return (
            <Card
                ref={ref}
                className={cn(className, "w-11/12 py-5 md:px-10 md:py-16", {
                    "w-full": type == "question",
                })}
                {...props}
            >
                <CardContent className="flex justify-between md:gap-x-5">
                    <div className="grid gap-y-3">
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage
                                            src={author.image ?? ""}
                                            alt={author.name}
                                        />
                                        <AvatarFallback>
                                            {author.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        {title && (
                                            <h2 className="text-lg font-bold md:text-xl">
                                                {title}
                                            </h2>
                                        )}
                                        <p className="text-xs">
                                            {author.name.length > 15
                                                ? author.name.split(" ")[0] +
                                                  " " +
                                                  author.name
                                                      .split(" ")[1]
                                                      ?.charAt(0) +
                                                  "."
                                                : author.name}{" "}
                                            le&nbsp;
                                            <DateFormatted format="dd/MM/yyyy à hh:mm:ss">
                                                {date}
                                            </DateFormatted>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm md:text-base">
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
                        onClickUpVote={async (
                            e: React.MouseEvent<SVGSVGElement, MouseEvent>,
                        ) => {
                            e.stopPropagation();
                            await handleUpVote();
                        }}
                        downvotes={downvotes}
                        onClickDownVote={async (
                            e: React.MouseEvent<SVGSVGElement, MouseEvent>,
                        ) => {
                            e.stopPropagation();
                            await handleDownVote();
                        }}
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
