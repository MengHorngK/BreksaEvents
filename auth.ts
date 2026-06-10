import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),

        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),

        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },

            },

            async authorize(credentials) {
                await connectToDatabase();

                const email = credentials?.email?.toLowerCase().trim();
                const password = credentials?.password;

                if (!email || !password) return null;

                const user = await User.findOne({ email });

                if (!user || !user.password) return null;

                const isPasswordCorrect = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordCorrect) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                } as any;
            },
        }),

        CredentialsProvider({
            id: "telegram",
            name: "Telegram",
            credentials: {
                telegramUser: { label: "Telegram User", type: "text" },
            },

            async authorize(credentials) {
                await connectToDatabase();

                if (!credentials?.telegramUser) return null;

                const telegramUser = JSON.parse(credentials.telegramUser);
                console.log("Telegram user data:", telegramUser);

                const telegramId = String(telegramUser.id);

                const name =
                    `${telegramUser.first_name || ""} ${
                        telegramUser.last_name || ""
                    }`.trim() ||
                    telegramUser.username ||
                    "Telegram User";

                const email = `telegram_${telegramId}@telegram.local`;

                const user = await User.findOneAndUpdate(
                    { email },
                    {
                        $set: {
                            name,
                            email,
                            username: telegramUser.username || "",
                            image: telegramUser.photo_url || "",
                            provider: "telegram",
                        },
                        $setOnInsert: {
                            role: "mentee",
                            kickoffStatus: "not_started",
                            canBookMentor: false,
                        },
                    },
                    {
                        new: true,
                        upsert: true,
                    }
                );
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    username:user.username,
                    provider: user.provider,
                } as any;
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            if (
                account?.provider === "google" ||
                account?.provider === "facebook"
            ) {
                await connectToDatabase();

                if (!user.email) return false;

                const email = user.email.toLowerCase().trim();

                const existingUser = await User.findOne({ email });

                if (!existingUser) {
                    await User.create({
                        name: user.name || "No name",
                        email,
                        image: user.image || "",
                        provider: account.provider,
                        role: "mentee",
                        kickoffStatus: "not_started",
                        canBookMentor: false,
                    });
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
                token.username = (user as any).username;
                token.provider = (user as any).provider;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).username = token.username;
                (session.user as any).provider = token.provider;
            }

            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },
};