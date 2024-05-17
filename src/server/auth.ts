import { env } from "@/env";
import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
    type DefaultSession,
    type NextAuthOptions,
    getServerSession,
} from "next-auth";
import type { Account, User } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { UserModel } from "prisma/zod";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    interface User {
        email_verified?: boolean;
    }
}

async function asignDefaultRole(userId: User["id"]) {
    // verify if user id is valid
    const resCheckUserId = UserModel.shape.id.safeParse(userId);
    if (!resCheckUserId.success) {
        log({
            type: TLog.error,
            text: "Invalid user id",
        });
        return false;
    }
    // verify if user exists
    let user = null;
    try {
        user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });
    } catch (e) {
        log({
            type: TLog.error,
            text: "Error while fetching user",
        });
        return false;
    }

    if (!user) {
        return false;
    }

    let userRoleId = null;
    let testerRoleId = null;

    // get the id of default roles
    try {
        userRoleId = await db.role.findFirst({
            where: {
                name: "user",
            },
        });
    } catch (e) {
        log({
            type: TLog.error,
            text: "Error while fetching user role",
        });
        return false;
    }

    if (!userRoleId) {
        return false;
    }

    try {
        testerRoleId = await db.role.findFirst({
            where: {
                name: "tester",
            },
        });
    } catch (e) {
        log({
            type: TLog.error,
            text: "Error while fetching tester role",
        });
        return false;
    }
    if (!testerRoleId) {
        return false;
    }

    let userRoles = null;

    // detect if user already has default roles
    try {
        userRoles = await db.userRole.findMany({
            where: {
                userId: userId,
            },
        });
    } catch (e) {
        log({
            type: TLog.error,
            text: "Error while fetching user roles",
        });
        return false;
    }

    let hasUserRole = false;
    let hasTesterRole = false;

    for (const role of userRoles) {
        switch (role.roleId) {
            case userRoleId.id:
                hasUserRole = true;
                break;
            case testerRoleId.id:
                hasTesterRole = true;
                break;
        }
    }

    // if user already has default roles, return
    if (hasUserRole && hasTesterRole) {
        return true;
    }

    let resUserRole = null;

    try {
        resUserRole = await db.userRole.create({
            data: {
                roleId: userRoleId.id,
                userId: userId,
            },
        });
    } catch (e) {
        log({
            type: TLog.error,
            text: "Error while creating user role",
        });
    }
    if (!resUserRole) return false;

    let resTesterRole = null;

    try {
        resTesterRole = await db.userRole.create({
            data: {
                roleId: testerRoleId.id,
                userId: userId,
            },
        });
    } catch (e) {
        log({
            type: TLog.error,
            text: "Error while creating tester role",
        });
    }
    if (!resTesterRole) return false;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    pages: {
        error: "/error",
    },
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
        async signIn({
            account,
            user,
        }: {
            account: Account | null;
            user: User;
        }) {
            if (account && user) {
                if (account.provider === "google" && user.email) {
                    const allowedEmail = await db.betaList.findFirst({
                        where: {
                            email: user.email,
                        },
                    });

                    await asignDefaultRole(user.id);
                    if (!allowedEmail) return false;
                    return true;
                }
            }
            return false;
        },
    },
    events: {
        createUser: async (message) => {
            await asignDefaultRole(message.user.id);
        },
    },
    adapter: PrismaAdapter(db),
    providers: [
        // if you want to use the Discord provider, you need to add the `DISCORD_CLIENT_ID` and
        // `DISCORD_CLIENT_SECRET` environment variables. You can do this by creating a `.env.local`
        // DiscordProvider({
        //   clientId: env.DISCORD_CLIENT_ID,
        //   clientSecret: env.DISCORD_CLIENT_SECRET,
        // }),

        GoogleProvider({
            clientId: env.GOOGLE_ID,
            clientSecret: env.GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
