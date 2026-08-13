// middleware.ts

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/blogs/new",
    "/blogs/:path*/edit",
  ],
};