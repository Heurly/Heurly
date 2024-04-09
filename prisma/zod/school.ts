import * as z from "zod";

export const SchoolModel = z.object({
    id: z.number().int(),
    name: z.string(),
});
