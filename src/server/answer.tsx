"use server";
import { dataCreateAnswer, formAnswerSchema } from "@/types/schema/form-answer";
import * as z from "zod";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { TLog, log } from "@/logger/logger";

export async function handleFormCreateAnswer(
    data: z.infer<typeof dataCreateAnswer>,
) {
    log({ type: TLog.info, text: "Handling form create answer" });
    // Validate the data
    const resParseRawData = formAnswerSchema.safeParse(data);
    if (!resParseRawData.success) {
        throw resParseRawData.error;
    }

    // verify the user
    const user = await db.user.findUnique({
        where: {
            id: data.userId,
        },
    });
    if (!user) {
        throw new Error("L'utilisateur n'existe pas");
    }

    // verify the question
    const question = await db.question.findUnique({
        where: {
            id: data.questionId,
        },
    });
    if (!question) {
        throw new Error("La question n'existe pas");
    }

    // Create the answer
    const res = await db.answer.create({
        data: {
            answer: data.content,
            userId: data.userId,
            questionId: data.questionId,
        },
    });
    // revalidate the data
    revalidatePath(`/revision/QandA/question/${data.questionId}`);
    return { success: true, data: res };
}
