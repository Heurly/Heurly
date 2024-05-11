import * as z from "zod";

export const SchoolHostnameModel = z.object({
	id: z.number().int(),
	hostname: z.string(),
	schoolId: z.number().int(),
});
