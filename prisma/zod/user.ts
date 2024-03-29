import * as z from "zod";

export const UserModel = z.object({
    id: z.string().cuid(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    emailVerified: z.date().nullish(),
    image: z.string().nullish(),
});
