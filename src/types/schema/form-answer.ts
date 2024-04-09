import { QuestionModel, UserModel } from "prisma/zod";
import * as z from "zod";
const maxCharsContent = 500;
const minCharsContent = 10;

export const dataCreateAnswer = z.object({
    // userId: z.string({ required_error: "L'utilisateur est requis" }).cuid(),
    userId: UserModel.shape.id,
    questionId: QuestionModel.shape.id,
    content: z.string().refine((data) => {
        formAnswerSchema.parse({ content: data });
    }),
});

export const formAnswerSchema = z.object({
    content: z
        .string({ required_error: "Le contenu est requis" })
        .max(maxCharsContent, {
            message: `Le contenu ne doit pas dépasser ${maxCharsContent} caractères`,
        })
        .min(minCharsContent, {
            message: `Le contenu doit contenir au moins ${minCharsContent} caractères`,
        }),
});
