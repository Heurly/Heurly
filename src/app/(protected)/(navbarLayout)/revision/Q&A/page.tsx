import QuestionCard from "@/components/Q&A/question-card";
import { Button } from "@/components/ui/button";
import ID from "@/utils/id";
import { MailQuestion, UserSearch } from "lucide-react";

export default function ListQuestions() {
    const questions = [
        {
            question: "Comment fait-on pour faire une soustraction ?",
            description:
                "Bonjour les lates je voudrais savoir comment fait on une soustraction. J'ai essayé de faire 2-2 mais je n'y arrive pas. Aussi, j'aimerais faire 2-3 mais je n'y arrive pas non plus. Merci de m'aider. Bonjour les lates je voudrais savoir comment fait on une soustraction. J'ai essayé de faire 2-2 mais je n'y arrive pas. Aussi, j'aimerais faire 2-3 mais je n'y arrive pas non plus. Merci de m'aider.",
            author: "Jean",
            date: new Date(),
            upvotes: 10,
            downvotes: 2,
            hasVotedUp: true,
        },
        {
            question: "Comment fait-on pour faire une addition ?",
            description:
                "Bonjour les lates je voudrais savoir comment fait on une addition",

            author: "Jean",
            date: new Date(),
            upvotes: 10,
            downvotes: 2,
            hasVotedDown: true,
        },

        {
            question: "Comment fait-on pour faire une multiplication ?",
            description:
                "Bonjour les lates je voudrais savoir comment fait on une multiplication",

            author: "Jean",
            date: new Date(),
            upvotes: 10,
            downvotes: 2,
            hasVotedUp: true,
        },
        {
            question: "Comment fait-on pour faire une soustraction ?",
            description:
                "Bonjour les lates je voudrais savoir comment fait on une soustraction",
            author: "Jean",
            date: new Date(),
            upvotes: 10,
            downvotes: 2,
            hasVotedDown: true,
        },
        {
            question: "Comment fait-on pour faire une addition ?",
            description:
                "Bonjour les lates je voudrais savoir comment fait on une addition",

            author: "Jean",
            date: new Date(),
            upvotes: 10,
            downvotes: 2,
            hasVotedUp: true,
        },

        {
            question: "Comment fait-on pour faire une multiplication ?",
            description:
                "Bonjour les lates je voudrais savoir comment fait on une multiplication",

            author: "Jean",
            date: new Date(),
            upvotes: 10,
            downvotes: 2,
            hasVotedDown: true,
        },
    ];

    return (
        <div className="flex w-full items-center justify-start gap-5 md:h-full md:overflow-auto">
            <div className="flex h-full flex-col items-center justify-start gap-5 overflow-auto md:w-11/12 ">
                {questions?.map((question) => (
                    <QuestionCard {...question} key={ID()} />
                ))}
            </div>
            <div className="hidden h-full w-1/12 flex-col gap-y-5 md:flex">
                <Button className="h-28 rounded-3xl">
                    <MailQuestion />
                </Button>
                <Button className="hidden h-24 rounded-3xl md:flex">
                    <UserSearch />
                </Button>
            </div>
            <Button className="fixed bottom-20 right-5 flex h-20 w-20 rounded-full p-7 md:hidden md:h-28">
                <MailQuestion />
            </Button>
        </div>
    );
}
