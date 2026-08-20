// lib/auth.ts

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import bcrypt from "bcryptjs";
import { CredentialsSignin } from "next-auth";

class CustomAuthError extends CredentialsSignin {
  constructor(msg: string) {
    super();
    this.code = msg;
  }
}

import { authConfig } from "@/auth.config";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,

  adapter: DrizzleAdapter(db),

  providers: [
    Google({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,

      allowDangerousEmailAccountLinking: true,

      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),

    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!user || !user.password) {
          throw new CustomAuthError("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new CustomAuthError("Please verify your email before logging in.");
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          throw new CustomAuthError("Invalid email or password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  

  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //     }

  //     return token;
  //   },

  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id =
  //         (token.id as string) ||
  //         (token.sub as string);
  //     }

  //     return session;
  //   },
  // },
});