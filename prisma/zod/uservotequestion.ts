import * as z from "zod";

export const UserVoteQuestionModel = z.object({
    id: z.number().int(),
    userId: z.string(),
    questionId: z.string(),
    vote: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
