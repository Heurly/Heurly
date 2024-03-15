import QandACard from "@/components/Q&A/QandA-card";
import FormAnswer from "@/components/form/form-answer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { getQuestionAndAnswers, getQuestionById } from "@/server/question";
import ID from "@/utils/id";
import nameToInitials from "@/utils/nameToInitials";
import { redirect } from "next/navigation";

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
    if (!params.id) redirect("/404");

    const session = await getServerAuthSession();
    if (!session) redirect("/login");

    const questionAndAnswersDb = await getQuestionAndAnswers(
        params.id,
        session.user.id,
    );
    if (!questionAndAnswersDb) redirect("/404");

    return (
        <div className="mt-16 flex h-full w-full flex-col items-center gap-y-5 overflow-auto md:mt-0">
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
            <Card className="w-11/12 py-5 md:p-7">
                <Avatar>
                    <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name ?? ""}
                    />
                    <AvatarFallback>
                        {nameToInitials(session.user.name ?? "")}
                    </AvatarFallback>
                </Avatar>
                <CardContent>
                    <FormAnswer
                        userId={session.user.id}
                        questionId={params.id}
                    />
                </CardContent>
            </Card>

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
