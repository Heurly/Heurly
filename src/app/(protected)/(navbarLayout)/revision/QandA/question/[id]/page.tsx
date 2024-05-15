import QandACard from "@/components/QandA/QandA-card";
import ResponseCard from "@/components/QandA/response-card";
import { getServerAuthSession } from "@/server/auth";
import { getQuestionAndAnswers, getQuestionById } from "@/server/question";
import ID from "@/utils/id";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props) {
    const question = await getQuestionById(params.id);
    if (!question) return null;
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
    if (!params.id) notFound();

    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    const questionAndAnswersDb = await getQuestionAndAnswers(
        params.id,
        session.user.id,
    );
    if (!questionAndAnswersDb) notFound();

    return (
        <div className="flex h-full w-full flex-col items-center gap-y-5 overflow-auto">
            <QandACard
                id={questionAndAnswersDb.id}
                type={"question"}
                title={questionAndAnswersDb.question}
                text={questionAndAnswersDb.description}
                date={questionAndAnswersDb.createdAt}
                author={questionAndAnswersDb.user ?? "anonymous"}
                upvotes={questionAndAnswersDb.upvotes}
                downvotes={questionAndAnswersDb.downvotes}
                nbrAnswers={questionAndAnswersDb.answer?.length}
                className="sticky top-0 z-10"
                hasVotedDown={
                    questionAndAnswersDb.UserVoteQuestion[0]?.vote === 0
                }
                hasVotedUp={
                    questionAndAnswersDb.UserVoteQuestion[0]?.vote === 1
                }
            />
            <ResponseCard user={session.user} questionId={params.id} />

            {questionAndAnswersDb.answer?.map(
                ({
                    answer,
                    upvotes,
                    downvotes,
                    createdAt,
                    user,
                    id,
                    UserVoteAnswer: [vote],
                }) => {
                    return (
                        <QandACard
                            id={id}
                            key={ID()}
                            type={"answer"}
                            text={answer}
                            date={createdAt}
                            author={user}
                            upvotes={upvotes}
                            downvotes={downvotes}
                            hasVotedUp={vote?.vote === 1}
                            hasVotedDown={vote?.vote === 0}
                            className="w-11/12"
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
