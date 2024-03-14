"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import DateFormatted from "@/components/ui/date-formatted";
import Vote from "@/components/Q&A/Vote";
import cn from "classnames";
import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { addVoteToAnswer, addVoteToQuestion } from "@/server/vote";
import { useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import nameToInitials from "@/utils/nameToInitials";

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
    nbrAnswers?: number;
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
            nbrAnswers: nbAnswers,
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

        const authorName =
            author.name.length > 15
                ? author.name.split(" ")[0] +
                  " " +
                  author.name.split(" ")[1]?.charAt(0) +
                  "."
                : author.name;

        return (
            <Card
                ref={ref}
                className={cn(
                    className,
                    "grid w-11/12 max-w-full grid-cols-[1fr_4rem] grid-rows-[6rem_1.5fr_3rem] gap-y-3 md:grid-cols-[1fr_6rem] md:gap-y-0",
                    {
                        "w-full": type == "question",
                    },
                )}
                {...props}
            >
                <CardHeader className="col-start-1">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={author.image ?? ""}
                                alt={author.name}
                            />
                            <AvatarFallback>
                                {nameToInitials(author.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            {title && (
                                <h2 className="font-bold md:text-lg">
                                    {title}
                                </h2>
                            )}
                            <p className="text-xs">
                                {authorName}&nbsp;le&nbsp;
                                <DateFormatted format="dd/MM/yyyy à hh:mm:ss">
                                    {date}
                                </DateFormatted>
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="col-start-1 flex items-start justify-between pr-0 md:gap-x-5 md:pr-[unset]">
                    <p className="self-center text-sm md:text-base">
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
                </CardContent>
                <CardFooter className="col-start-1">
                    {typeof nbAnswers == "number" && (
                        <div className="flex items-center justify-center gap-1">
                            <Reply />
                            {nbAnswers}
                        </div>
                    )}
                </CardFooter>
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
                    className="col-start-2 row-span-3 row-start-1 pt-5"
                />
            </Card>
        );
    },
);

QandACard.displayName = "QandACard";

export default QandACard;
