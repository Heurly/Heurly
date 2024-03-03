import QandACard from "@/components/Q&A/QandA-card";
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
        <div className="flex h-full flex-col items-end gap-y-5 overflow-auto">
            <QandACard
                type={"question"}
                title={questionAndAnswersDb.question}
                text={questionAndAnswersDb.description}
                date={questionAndAnswersDb.createdAt}
                author={"anonymous"}
                upvotes={questionAndAnswersDb.upvotes}
                downvotes={questionAndAnswersDb.downvotes}
            />

            {questionAndAnswersDb.answer?.map(({ answer }) => {
                return (
                    <QandACard
                        key={ID()}
                        type={"answer"}
                        title={answer}
                        text={answer}
                        date={questionAndAnswersDb.createdAt}
                        author={"anonymous"}
                        upvotes={questionAndAnswersDb.upvotes}
                        downvotes={questionAndAnswersDb.downvotes}
                    />
                );
            })}
            {questionAndAnswersDb.answer?.length === 0 && (
                <p>Aucune réponse trouvée</p>
            )}
        </div>
    );
}
