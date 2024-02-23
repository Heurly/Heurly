import * as z from "zod";

export const fileFormDocsSchema = z.object({
    file: z
        .object({
            size: z.number(),
            type: z.string(),
        })
        .refine((value) => value.type === "application/pdf", {
            message: "Le fichier doit être au format PDF",
            path: ["file"], // Set the error path to 'file'
        })
        .refine((value) => value.size <= 5000000, {
            message: "La taille du fichier ne doit pas dépasser 5MB",
            path: ["file"], // Set the error path to 'file'
        }),
});
