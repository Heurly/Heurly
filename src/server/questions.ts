"use server";
import type { Question } from "@prisma/client";
import { db } from "@/server/db";

export async function getQuestions(nbQuestion = 10) {
    try {
        const questions = await db.question.findMany({
            take: nbQuestion,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
            },
        });
        return questions;
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
                answer: true,
            },
        });

        if (questionAndAnswers) {
            questionAndAnswers.answer.sort(
                (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
            );
        }

        return questionAndAnswers;
    } catch (e) {
        throw new Error("An error occured while fetching the question");
    }
}
