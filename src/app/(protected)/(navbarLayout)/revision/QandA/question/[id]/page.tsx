import QandACard from "@/components/Q&A/QandA-card";
import FormAnswer from "@/components/form/form-answer";
import { Card, CardContent } from "@/components/ui/card";
import { getQuestionAndAnswers } from "@/server/questions";
import ID from "@/utils/id";
import { redirect } from "next/navigation";

export default async function QuestionPage({
    params,
}: {
    params: { id: string };
}) {
    if (!params.id) redirect("/404");
    const questionAndAnswersDb = await getQuestionAndAnswers(params.id);
    if (!questionAndAnswersDb) redirect("/404");

    return (
        <div className="flex h-full flex-col items-center gap-y-5 overflow-auto">
            <QandACard
                type={"question"}
                title={questionAndAnswersDb.question}
                text={questionAndAnswersDb.description}
                date={questionAndAnswersDb.createdAt}
                author={"anonymous"}
                upvotes={questionAndAnswersDb.upvotes}
                downvotes={questionAndAnswersDb.downvotes}
                className="sticky top-0"
            />
            <Card className="w-11/12 px-10 py-16">
                <CardContent>
                    <FormAnswer />
                </CardContent>
            </Card>

            {questionAndAnswersDb.answer?.map(
                ({ answer, upvotes, downvotes, createdAt }) => {
                    return (
                        <QandACard
                            key={ID()}
                            type={"answer"}
                            title={answer}
                            text={answer}
                            date={createdAt}
                            author={"anonymous"}
                            upvotes={upvotes}
                            downvotes={downvotes}
                        />
                    );
                },
            )}
            {questionAndAnswersDb.answer?.length === 0 && (
                <p>Aucune réponse trouvée</p>
            )}
        </div>
    );
}
