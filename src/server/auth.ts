import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import { db } from "@/server/db";
import { User, Account } from "next-auth";

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

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
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
                if (
                    account.provider === "google" &&
                    user.email &&
                    user.email_verified
                ) {
                    return user.email.endsWith("@edu.esiee.fr");
                }
                return true;
            }
            return false;
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
