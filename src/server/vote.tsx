"use server";
import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import type { Answer, Question } from "@prisma/client";

enum Vote {
    up = 1,
    down = 0,
}

export async function addVoteToQuestion(
    questionId: Question["id"],
    vote: Vote,
) {
    log({ type: TLog.info, text: `Adding vote to question $${questionId}` });
    try {
        const question = await db.question.findUnique({
            where: {
                id: questionId,
            },
        });

        if (!question) {
            throw new Error("Question not found");
        }

        // search if the user has already voted
        const userVote = await db.userVoteQuestion.findFirst({
            where: {
                questionId: questionId,
                userId: question.userId,
            },
        });
        if (userVote) {
            // if the vote of the user is the same as the vote we want to add, we remove the vote
            if ((userVote.vote as Vote) == vote) return;

            const resUpdateVoteQuestion = await db.userVoteQuestion.update({
                where: {
                    id: userVote.id,
                },
                data: {
                    vote: vote,
                },
            });
            return {
                success: true,
                data: resUpdateVoteQuestion,
            };
        }

        await db.userVoteQuestion.create({
            data: {
                questionId: questionId,
                userId: question.userId,
                vote: vote,
            },
        });
    } catch (e) {
        throw new Error(
            `An error occured while adding the vote for the question : ${questionId}`,
        );
    }
}

export async function addVoteToAnswer(answerId: Answer["id"], vote: Vote) {
    log({ type: TLog.info, text: `Adding vote to answer $${answerId}` });
    try {
        const answer = await db.answer.findUnique({
            where: {
                id: answerId,
            },
        });

        if (!answer) {
            throw new Error("Answer not found");
        }

        // search if the user has already voted
        const userVote = await db.userVoteAnswer.findFirst({
            where: {
                answerId: answerId,
                userId: answer.userId,
            },
        });
        if (userVote) {
            // if the vote of the user is the same as the vote we want to add, we remove the vote
            if ((userVote.vote as Vote) == vote) return;

            const resUpdateVoteAnswer = await db.userVoteAnswer.update({
                where: {
                    id: userVote.id,
                },
                data: {
                    vote: vote,
                },
            });

            return {
                success: true,
                data: resUpdateVoteAnswer,
            };
        }

        await db.userVoteAnswer.create({
            data: {
                answerId: answerId,
                userId: answer.userId,
                vote: vote,
            },
        });
    } catch (e) {
        throw new Error(
            `An error occured while adding the vote to the answer : ${answerId}`,
        );
    }
}
