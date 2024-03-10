import * as z from "zod";

export const AnswerModel = z.object({
    id: z.string().cuid(),
    answer: z.string(),
    questionId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string(),
});
