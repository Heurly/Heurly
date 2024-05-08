import * as z from "zod";

export const formCreateQuestionSchema = z.object({
	question: z.string().min(5).max(100),
	description: z.string().min(5).max(500),
});

export const dataCreateQuestionSchema = z.object({
	question: z.string().min(5).max(100),
	description: z.string().min(5).max(500),
	userId: z.string().cuid(),
});
