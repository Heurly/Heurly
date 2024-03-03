import QandACard from "@/components/Q&A/QandA-card";
import FormAnswer from "@/components/form/form-answer";
import { Card, CardContent } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { getQuestionAndAnswers, getQuestionById } from "@/server/question";
import ID from "@/utils/id";
import { redirect } from "next/navigation";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props) {
    const question = await getQuestionById(params.id);
    const title = question?.question;
    const description = question?.description;
    return {
        title,
        description,
    };
}

export default async function QuestionPage({
    params,
}: {
    params: { id: string };
}) {
    if (!params.id) redirect("/404");
    const questionAndAnswersDb = await getQuestionAndAnswers(params.id);

    if (!questionAndAnswersDb) redirect("/404");

    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    return (
        <div className="flex h-full flex-col items-center gap-y-5 overflow-auto">
            <QandACard
                id={questionAndAnswersDb.id}
                type={"question"}
                title={questionAndAnswersDb.question}
                text={questionAndAnswersDb.description}
                date={questionAndAnswersDb.createdAt}
                author={questionAndAnswersDb.user ?? "anonymous"}
                upvotes={questionAndAnswersDb.upvotes}
                downvotes={questionAndAnswersDb.downvotes}
                className="sticky top-0 z-10"
            />
            <Card className="w-11/12 px-10 py-16">
                <CardContent>
                    <FormAnswer
                        userId={session.user.id}
                        questionId={params.id}
                    />
                </CardContent>
            </Card>

            {questionAndAnswersDb.answer?.map(
                ({ answer, upvotes, downvotes, createdAt, id }) => {
                    return (
                        <QandACard
                            id={id}
                            key={ID()}
                            type={"answer"}
                            text={answer}
                            date={createdAt}
                            author={questionAndAnswersDb.user}
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
