import * as z from "zod";

export const formCreateEventSchema = z.object({
    event: z.string().min(5).max(100),
    description: z.string().min(5).max(5000),
    userId: z.string().cuid(),
    urlImage: z.string(),
    location: z.string(),
    eventDate: z.string(),
});

export const dataCreateEventSchema = z.object({
    event: z.string().min(5).max(100),
    description: z.string().min(5).max(500),
    userId: z.string().cuid(),
    urlImage: z.string(),
    location: z.string(),
    eventDate: z.string(),
});
