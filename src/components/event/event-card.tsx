"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import DateFormatted from "@/components/ui/date-formatted";
import Vote from "@/components/QandA/Vote";
import cn from "classnames";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { addVoteToAnswer, addVoteToQuestion } from "@/server/vote";
import { useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import nameToInitials from "@/utils/nameToInitials";
import Participate from "./participate";

type PropsEventCard = {
    id: string;
    title?: string;
    description: string;
    image: URL;
    date: Date;
    author: User;
    location: string;
    nbParticipants: number;
    hasParticipated?: boolean;
    className?: string;
};

const EventCard = React.forwardRef<HTMLDivElement, PropsEventCard>(
    (
        {
            id,
            className,
            title,
            description,
            date,
            author,
            nbParticipants,
            hasParticipated,
            image,
            location,
            ...props
        },
        ref,
    ) => {
        const [seeMore, setSeeMore] = useState(false);
        const router = useRouter();
        async function handleSeeMore(e: React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault();
            setSeeMore(!seeMore);
        }
        async function handleParticipate(
            e: React.MouseEvent<SVGSVGElement, MouseEvent>,
        ) {
            e.preventDefault();
            await addVoteToQuestion(id, 1);
            router.refresh();
        }

        if (!author.name) return;

        const authorName =
            author.name.length > 15
                ? `${author.name.split(" ")[0]} ${author.name
                      .split(" ")[1]
                      ?.charAt(0)}.`
                : author.name;

        return (
            <Card
                ref={ref}
                className={cn(
                    className,
                    "grid max-w-full grid-cols-[1fr_4rem] grid-rows-[6rem_1.5fr_3rem] gap-y-3 md:grid-cols-[1fr_6rem] md:gap-y-0",
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
                            description.length > 200 && !seeMore ? (
                                <>{description.substring(0, 200)}...</>
                            ) : (
                                // Otherwise, show the full text
                                description
                            )
                        }
                        {
                            // If the text length is more than 200, show a button to toggle the text display
                            description.length > 200 && (
                                <Button
                                    variant="link"
                                    className="h-0 p-0"
                                    onClick={handleSeeMore}
                                >
                                    {!seeMore ? "Voir plus" : "Voir moins"}
                                </Button>
                            )
                        }
                    </p>
                </CardContent>
                <CardFooter className="col-start-1">
                    {typeof nbParticipants == "number" && (
                        <div className="flex items-center justify-center gap-1">
                            <Reply />
                            {nbParticipants}
                        </div>
                    )}
                </CardFooter>
                <Participate
                    nbParticipants={nbParticipants}
                    onClickParticipate={async (
                        e: React.MouseEvent<SVGSVGElement, MouseEvent>,
                    ) => await handleParticipate(e)}
                    className="col-start-2 row-span-3 row-start-1 pt-5"
                    hasParticipated={hasParticipated ?? false}
                />
            </Card>
        );
    },
);

EventCard.displayName = "EventCard";

export default EventCard;
