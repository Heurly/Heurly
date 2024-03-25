import QandACard from "@/components/QandA/QandA-card";
import { getQuestions } from "@/server/question";
import ID from "@/utils/id";
import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Heuly - Questions",
    description:
        "Cette page répertorie toutes les questions posées par les utilisateurs d'Heurly ! Vous pouvez y répondre ou poser votre propre question.",
};

export default async function ListQuestionsPage() {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");
    const questions = await getQuestions(10, session.user.id);

    return (
        <>
            {questions?.map((question) => (
                <Link
                    href={`/revision/QandA/question/${question.id}`}
                    key={ID()}
                    className="w-full"
                >
                    <QandACard
                        id={question.id}
                        type={"question"}
                        title={question.question}
                        text={question.description}
                        date={question.createdAt}
                        author={question.user}
                        upvotes={question.upvotes}
                        downvotes={question.downvotes}
                        nbrAnswers={question._count.answer}
                        hasVotedUp={question.UserVoteQuestion[0]?.vote === 1}
                        hasVotedDown={question.UserVoteQuestion[0]?.vote === 0}
                    />
                </Link>
            ))}
            {questions.length === 0 && <p>Aucune question trouvée</p>}
        </>
    );
}
