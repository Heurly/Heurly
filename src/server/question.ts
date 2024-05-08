"use server";
import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import type { CourseDate } from "@/types/courses";
import { dataCreateQuestionSchema } from "@/types/schema/form-create-question";
import type { Question, User } from "@prisma/client";
import { QuestionModel, UserModel } from "prisma/zod";
import * as z from "zod";

/**
 *
 * @param questionId The id of the question to get
 * @returns {Promise<Question>} A promise that resolves to a question
 */
export async function getQuestionById(
	questionId: Question["id"],
): Promise<Question | null> {
	log({ type: TLog.info, text: "Fetching question by id" });

	// validate the id
	const resCheckQuestionID = QuestionModel.shape.id.safeParse(questionId);
	if (!resCheckQuestionID.success) {
		throw new Error("Invalid id");
	}

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
/**
 *
 * @param nbQuestion the number of questions to fetch
 * @param userId the id of the user, if provided, the function will return the votes of the user
 *
 */
export async function getQuestions(nbQuestion = 10, userId?: User["id"]) {
	log({ type: TLog.info, text: "Fetching questions" });

	const resCheckUserId = UserModel.shape.id.safeParse(userId);
	if (!resCheckUserId.success) throw new Error("Invalid user id");

	const resCheckNb = z.number().safeParse(nbQuestion);
	if (!resCheckNb.success) throw new Error("Invalid number of questions");

	try {
		const questions = await db.question.findMany({
			take: nbQuestion,
			orderBy: {
				createdAt: "desc",
			},
			include: {
				user: true,
				UserVoteQuestion: {
					where: {
						userId: userId,
					},
				},
				_count: {
					select: { answer: true },
				},
			},
		});

		// insert the number of upvotes and downvotes for each question
		const resQuestions = questions.map((question) => {
			const upvotes = question.UserVoteQuestion.filter(
				(vote) => vote.vote === 1,
			).length;
			const downvotes = question.UserVoteQuestion.filter(
				(vote) => vote.vote === 0,
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

/**
 *
 * @param questionId The id of the question to get
 * @param userId The id of the user, if provided, the function will return the votes of the user
 * @returns {Promise<Question>} A promise that resolves to a question
 */
export async function getQuestionAndAnswers(
	questionId: Question["id"],
	userId?: User["id"],
) {
	log({ type: TLog.info, text: "Fetching question and answers" });

	// validate the question id
	const resCheckQuestionID = QuestionModel.shape.id.safeParse(questionId);
	if (!resCheckQuestionID.success) {
		throw new Error("Invalid id");
	}

	// validate the user id
	const resCheckUserId = UserModel.shape.id.safeParse(userId);
	if (!resCheckUserId.success) throw new Error("Invalid user id");

	try {
		const questionAndAnswers = await db.question.findUnique({
			where: {
				id: questionId,
			},
			include: {
				user: true,
				UserVoteQuestion: {
					where: {
						userId: userId,
					},
				},
				answer: {
					include: {
						UserVoteAnswer: {
							where: {
								userId: userId,
							},
						},
						user: true,
					},
				},
			},
		});

		if (!questionAndAnswers) throw new Error("Question not found");

		// get the number of upvotes and downvotes
		const upvotes = questionAndAnswers.UserVoteQuestion.filter(
			(vote) => vote.vote === 1,
		).length;
		const downvotes = questionAndAnswers.UserVoteQuestion.filter(
			(vote) => vote.vote === 0,
		).length;

		// get the number of upvotes and downvotes for each answer
		const tabAnswers = questionAndAnswers.answer.map((answer) => {
			const upvotes = answer.UserVoteAnswer.filter(
				(vote) => vote.vote === 1,
			).length;
			const downvotes = answer.UserVoteAnswer.filter(
				(vote) => vote.vote === 0,
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

/**
 *
 * @param data The data to create the question
 * @returns {Promise<{success: boolean, data: Question}>} A promise that resolves to an object with a success boolean and the created question
 */
export async function handleFormCreateQuestion(
	data: z.infer<typeof dataCreateQuestionSchema>,
): Promise<{ success: boolean; data: Question }> {
	log({ type: TLog.info, text: "Handling form create question" });
	// Validate the data
	const resParseRawData = dataCreateQuestionSchema.safeParse(data);
	if (!resParseRawData.success) {
		throw resParseRawData.error;
	}

	let resCreateQuestion = null;

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

export async function getCourseDataQuestions(courseDate: CourseDate) {
	return db.question.findMany({
		where: {
			courseId: courseDate.courseId,
			courseDate: courseDate.courseDate,
		},
	});
}
