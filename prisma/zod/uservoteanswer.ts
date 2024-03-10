import * as z from "zod"


export const UserVoteAnswerModel = z.object({
  id: z.number().int(),
  userId: z.string(),
  answerId: z.string(),
  vote: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
