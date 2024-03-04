"use server";
import type { Question } from "@prisma/client";
import { db } from "@/server/db";
import * as z from "zod";
import { dataCreateQuestionSchema } from "@/types/schema/form-create-question";

export async function getQuestionById(questionId: Question["id"]) {
    try {
        const questionById = await db.question.findUnique({
            where: {
                id: questionId,
            },
        });

        return questionById;
    } catch (e) {
        throw new Error("An error occured while fetching the question");
    }
}

export async function getQuestions(nbQuestion = 10) {
    try {
        const questions = await db.question.findMany({
            take: nbQuestion,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
                UserVoteQuestion: true,
            },
        });

        // insert the number of upvotes and downvotes for each question
        const resQuestions = questions.map((question) => {
            const upvotes = question.UserVoteQuestion.filter(
                (vote) => vote.vote == 1,
            ).length;
            const downvotes = question.UserVoteQuestion.filter(
                (vote) => vote.vote == 0,
            ).length;
            return { ...question, upvotes, downvotes };
        });

        // sort the questions by the number of upvotes - downvotes
        resQuestions.sort(
            (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
        );

        return resQuestions;
    } catch (e) {
        throw new Error("An error occured while fetching the questions");
    }
}

export async function getQuestionAndAnswers(id: Question["id"]) {
    try {
        const questionAndAnswers = await db.question.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                UserVoteQuestion: true,
                answer: {
                    include: {
                        UserVoteAnswer: true,
                        user: true,
                    },
                },
            },
        });

        if (!questionAndAnswers) throw new Error("Question not found");

        // get the number of upvotes and downvotes
        const upvotes = questionAndAnswers.UserVoteQuestion.filter(
            (vote) => vote.vote == 1,
        ).length;
        const downvotes = questionAndAnswers.UserVoteQuestion.filter(
            (vote) => vote.vote == 0,
        ).length;

        // get the number of upvotes and downvotes for each answer
        const tabAnswers = questionAndAnswers.answer.map((answer) => {
            const upvotes = answer.UserVoteAnswer.filter(
                (vote) => vote.vote == 1,
            ).length;
            const downvotes = answer.UserVoteAnswer.filter(
                (vote) => vote.vote == 0,
            ).length;
            return { ...answer, upvotes, downvotes };
        });

        const res = {
            ...questionAndAnswers,
            upvotes,
            downvotes,
            answer: tabAnswers,
        };

        // sort the answers by the number of upvotes - downvotes
        res.answer.sort(
            (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
        );
        return res;
    } catch (e) {
        throw new Error("An error occured while fetching the question");
    }
}

export async function handleFormCreateQuestion(
    data: z.infer<typeof dataCreateQuestionSchema>,
) {
    // Validate the data
    const resParseRawData = dataCreateQuestionSchema.safeParse(data);
    if (!resParseRawData.success) {
        throw resParseRawData.error;
    }

    let resCreateQuestion;

    // Create the question
    try {
        resCreateQuestion = await db.question.create({
            data: {
                question: data.question,
                description: data.description,
                userId: data.userId,
            },
        });
    } catch (e) {
        throw new Error("An error occured while creating the question");
    }

    // return the data
    return { success: true, data: resCreateQuestion };
}
