import * as z from "zod";

export const DocsModel = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	url: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
});
