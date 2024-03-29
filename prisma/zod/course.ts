import * as z from "zod";

export const CourseModel = z.object({
    id: z.number().int(),
    code_cours: z.string(),
    nom_cours: z.string(),
    professeur: z.string().nullish(),
    description: z.string().nullish(),
    schoolId: z.number().int().nullish(),
});
