"use client";

import { Card } from "../ui/card";
import DateFormatted from "../ui/date-formatted";
import Vote from "@/components/Q&A/Vote";

type PropsQuestionCard = {
    question: string;
    description: string;
    date: Date;
    author: string;
    upvotes: number;
    downvotes: number;
    hasVotedDown?: boolean;
    hasVotedUp?: boolean;
};

export default function QuestionCard({
    question,
    description,
    date,
    author,
    upvotes,
    downvotes,
    hasVotedDown = false,
    hasVotedUp = false,
}: PropsQuestionCard) {
    function handleUpVote() {
        console.log("upvote");
    }

    function handleDownVote() {
        console.log("downvote");
    }
    return (
        <Card className="flex w-full justify-between bg-white p-10 md:gap-x-5">
            <div className="grid gap-y-3">
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">{question}</h2>
                        <p className=" text-sm">
                            {author} le{" "}
                            <DateFormatted format="dd/MM/yyyy à hh:mm:ss">
                                {date}
                            </DateFormatted>
                        </p>
                    </div>
                </div>
                <p>
                    {description.length > 100
                        ? description.substring(0, 100) + "..."
                        : description}
                </p>
            </div>
            <Vote
                upvotes={upvotes}
                onClickUpVote={handleUpVote}
                downvotes={downvotes}
                onClickDownVote={handleDownVote}
                hasVotedDown={hasVotedDown}
                hasVotedUp={hasVotedUp}
            />
        </Card>
    );
}
