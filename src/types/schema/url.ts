import { z } from "zod";

export const schemaUrl = z.string().url().min(1);

export type TCustomURL = z.infer<typeof schemaUrl>;
