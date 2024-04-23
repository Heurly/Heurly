import * as z from "zod";
export const EventModel = z.object({
    event: z.string().min(5).max(100),
    description: z.string().min(5).max(500),
    userId: z.string().cuid(),
    urlImage: z.string(),
    location: z.string(),
    eventDate: z.string(),
});
