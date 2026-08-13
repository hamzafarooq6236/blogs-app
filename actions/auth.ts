"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import sgMail from "@sendgrid/mail";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function signUpAction(data: { name?: string; email: string; password: string }) {
    try {
        if (!data.email || !data.password) {
            return { success: false, error: "Email and password are required." };
        }

        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, data.email));

        if (existingUsers.length > 0) {
            return { success: false, error: "User already exists" };
        }

        const userId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const token = crypto.randomBytes(32).toString("hex");
        const verifyLink = `${process.env.NEXTAUTH_URL}/auth/verifyEmail?token=${token}`;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const [newUser] = await db
            .insert(users)
            .values({
                id: userId,
                name: data.name || null,
                email: data.email,
                password: hashedPassword,
                verificationToken: hashedToken,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
            });

        if (!process.env.SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY has not been setup in environment variables.");
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: newUser.email,
            from: "hamzafarooq109@gmail.com",
            subject: "Email Verification Link",
            text: `Please verify your email: ${verifyLink}`,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;">
<tr>
<td align="center">
<h1 style="margin:0;color:#2563eb;">BlogsApp</h1>
<p style="margin-top:10px;color:#6b7280;font-size:15px;">Verify Your Email Address</p>
</td>
</tr>
<tr>
<td style="padding-top:30px;color:#374151;font-size:16px;line-height:28px;">
Hello,<br><br>
Thank you for creating an account with <strong>BlogsApp</strong>.<br>
To activate your account, please verify your email address by clicking the button below.
</td>
</tr>
<tr>
<td align="center" style="padding:35px 0;">
<a href="${verifyLink}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:16px 36px;text-decoration:none;font-size:16px;font-weight:bold;border-radius:8px;">
Verify Email
</a>
</td>
</tr>
<tr>
<td style="color:#374151;font-size:15px;line-height:24px;">
This verification link will expire in <strong>24 hours</strong>.
</td>
</tr>
<tr>
<td style="padding-top:25px;color:#6b7280;font-size:14px;line-height:24px;">
If the button above doesn't work, copy and paste the following link into your browser:<br><br>
<a href="${verifyLink}" style="color:#2563eb;word-break:break-all;">${verifyLink}</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
`,
        };

        await sgMail.send(msg);
        return { success: true, message: "Verification email has been sent to your email. Check your Inbox." };
    } catch (error: any) {
        console.error("Signup error:", error);
        return { success: false, error: error.message || "Internal server error" };
    }
}

export async function verifyEmailAction(token: string) {
    try {
        if (!token) {
            return { success: false, error: "Token missing" };
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.verificationToken, hashedToken))
            .limit(1);

        const user = existingUsers[0];
        if (!user) {
            return { success: false, error: "Invalid or expired link" };
        }

        await db
            .update(users)
            .set({ verificationToken: null, emailVerified: new Date() })
            .where(eq(users.email, user.email));

        return { success: true, message: "Account Verified successfully" };
    } catch (error: any) {
        console.error("Verify email error:", error);
        return { success: false, error: error.message || "Failed to verify email" };
    }
}
