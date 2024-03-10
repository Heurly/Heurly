import * as z from "zod"


export const QuestionModel = z.object({
  id: z.string().cuid(),
  question: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})
