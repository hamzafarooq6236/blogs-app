// auth.config.ts

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/auth/signin",
    },

    session: {
        strategy: "jwt",
        // maxAge: 60 * 60 * 24 * 7,
        maxAge: 300,
    },
    jwt: {
        maxAge: 300,
    },

    trustHost: true,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id =
                    (token.id as string) ||
                    (token.sub as string);
            }

            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // const isDashboard =
            //     nextUrl.pathname.startsWith("/dashboard");

            // const isSettings =
            //     nextUrl.pathname.startsWith("/settings");

            // const isEditBlog =
            //     nextUrl.pathname.includes("/blogs");

            // if (isDashboard || isSettings || isEditBlog) {
            //     return isLoggedIn;
            // }

            return isLoggedIn;
        },
    },

    providers: [],
} satisfies NextAuthConfig;