import * as z from "zod";

export const UserTimetableURLModel = z.object({
    id: z.number().int(),
    userId: z.string(),
    url: z.string(),
});
