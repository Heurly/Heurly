import * as z from "zod";

export const fileFormDocsSchema = z.object({
    file: z.object({
        name: z.string(),
        size: z.number().max(5000000, {
            message: "File is too big",
        }), // 5mb
        type: z.string().and(
            z.string().refine(
                (value) => {
                    value === "application/pdf";
                },
                {
                    message: "File must be a pdf",
                },
            ),
        ), // only pdf
        lastModified: z.number(),
        lastModifiedDate: z.date(),
    }),
});
