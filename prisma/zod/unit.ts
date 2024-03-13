import * as z from "zod";

export const UnitModel = z.object({
    id: z.number().int(),
    name: z.string(),
    fullName: z.string(),
    code: z.number().int(),
});
