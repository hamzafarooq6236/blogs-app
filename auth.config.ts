// auth.config.ts

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/auth/signin",
    },

    callbacks: {
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