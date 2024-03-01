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
        <div>
            {questionAndAnswersDb.question}

            <div>
                {questionAndAnswersDb.answer?.map(({ answer }) => {
                    return <div key={ID()}>{answer}</div>;
                })}
            </div>
        </div>
    );
}
