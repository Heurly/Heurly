import QandACard from "@/components/Q&A/QandA-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { getQuestions } from "@/server/questions";
import ID from "@/utils/id";
import { MailQuestion, UserSearch } from "lucide-react";
import Link from "next/link";

import cn from "classnames";

export default async function ListQuestions() {
    const questions = await getQuestions();

    return (
        <div className="flex w-full items-center justify-start gap-5 md:h-full md:overflow-auto">
            <div className="flex h-full flex-col items-center justify-start gap-5 overflow-auto md:w-11/12 ">
                {questions?.map((question) => (
                    <Link
                        href={`/revision/QandA/question/${question.id}`}
                        key={ID()}
                        className="w-full"
                    >
                        <QandACard
                            type={"question"}
                            title={question.question}
                            text={question.description} // Renamed from descriptijon
                            date={question.createdAt} // Assuming createdAt is the date
                            author={question.user.name ?? "anonymous"} // Assuming userId is the author
                            upvotes={question.upvotes}
                            downvotes={question.downvotes}
                        />
                    </Link>
                ))}
                {questions.length === 0 && <p>Aucune question trouvée</p>}
            </div>
            <div className="hidden h-full w-1/12 flex-col gap-y-5 md:flex">
                <Link
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "h-28",
                    )}
                    href="/revision/QandA/create"
                >
                    <MailQuestion />
                </Link>
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
