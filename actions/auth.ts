"use server";

import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
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
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
            });

        const id = crypto.randomUUID();
        await db
            .insert(verificationTokens)
            .values({
                challengeId: id,
                userId: newUser.id,
                verificationToken: hashedToken,
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
            .from(verificationTokens)
            .where(eq(verificationTokens.verificationToken, hashedToken))
            .limit(1);

        const user = existingUsers[0];
        if (!user) {
            return { success: false, error: "Invalid or expired link" };
        }

        await db
            .update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.id, user.userId));

        await db
            .update(verificationTokens)
            .set({ verificationToken: null })
            .where(eq(verificationTokens.userId, user.userId));

        return { success: true, message: "Account Verified successfully" };
    } catch (error: any) {
        console.error("Verify email error:", error);
        return { success: false, error: error.message || "Failed to verify email" };
    }
}

export async function forgotPasswordAction(email: string) {
    if (!email) {
        return { success: false, error: "invalid email" };
    }

    try {
        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = existingUsers[0];
        if (!user) {
            return { success: true, message: "If an account exists, an OTP has been sent to registered email.", cid: null };
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const resetLink = `http://localhost:3000/auth/resetpassword?token=${token}`;
        const id = crypto.randomUUID();
        
        await db.insert(verificationTokens).values({
            userId: user.id,
            challengeId: id,
            otp: otp,
            verificationToken: hashedToken,
        });

        if (!process.env.SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY has not been setup in environmental variables.");
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: user.email,
            from: 'hamzafarooq109@gmail.com',
            subject: "Your Password Reset OTP",
            text: 'Hello plain world!',
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;">
<tr>
<td align="center">
<h1 style="margin:0;color:#2563eb;">BlogsApp</h1>
<p style="color:#6b7280;font-size:15px;">Password Reset Request</p>
</td>
</tr>
<tr>
<td style="padding-top:30px;color:#374151;font-size:16px;line-height:26px;">
Hello,<br><br>We received a request to reset your password. You can either click the button below or use the verification code.
</td>
</tr>
<tr>
<td align="center" style="padding:35px 0;">
<a href="${resetLink}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:16px 30px;text-decoration:none;font-size:16px;font-weight:bold;border-radius:8px;">Reset Password</a>
</td>
</tr>
<tr>
<td align="center">
<p style="color:#6b7280;font-size:14px;margin-bottom:12px;">Or enter this verification code:</p>
<div style="display:inline-block;background:#f3f4f6;border:2px dashed #2563eb;padding:18px 35px;font-size:34px;font-weight:bold;letter-spacing:8px;border-radius:10px;color:#111827;">${otp}</div>
</td>
</tr>
<tr>
<td style="padding-top:30px;color:#374151;font-size:15px;line-height:24px;">Both the reset link and verification code expire in <strong>10 minutes</strong>.</td>
</tr>
<tr>
<td style="padding-top:20px;color:#6b7280;font-size:14px;line-height:22px;">If the button doesn't work, copy and paste this link into your browser:<br><br><a href="${resetLink}" style="word-break:break-all;color:#2563eb;">${resetLink}</a></td>
</tr>
<tr>
<td style="padding-top:20px;color:#dc2626;font-size:15px;">Never share your verification code or reset link with anyone.</td>
</tr>
<tr>
<td style="padding-top:40px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:13px;">This is an automated email from <strong>BlogsApp</strong>. Please do not reply.</td>
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
        return { success: true, message: "If an account exists, an OTP has been sent to registered email.", cid: id };
    } catch (error: any) {
        console.error("Forgot password error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}

export async function verifyOtpAction(otpInput: string, cid: string) {
    if (!otpInput || !cid) {
        return { success: false, error: "otp is invalid" };
    }

    try {
        const userTokenRecord = await db.select().from(verificationTokens).where(eq(verificationTokens.challengeId, cid)).limit(1);
        if (!userTokenRecord || userTokenRecord.length === 0) {
            return { success: false, error: "otp is invalid" };
        }
        const otp = userTokenRecord[0].otp;
        if (!otp) {
            return { success: false, error: "otp is invalid" };
        }

        if (String(otpInput) === String(otp)) {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            
            await db.update(verificationTokens)
                    .set({ verificationToken: hashedToken, otp: null })
                    .where(eq(verificationTokens.challengeId, cid));

            return { success: true, message: "OTP verified successfully", token: resetToken };
        }

        return { success: false, error: "Invalid OTP" };
    } catch (error: any) {
        console.error("Verify OTP error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resetPasswordAction(password: string, token: string) {
    if (!password || !token) {
        return { success: false, error: "password and token are required" };
    }

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        
        const existingTokens = await db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.verificationToken, hashedToken))
            .limit(1);

        const verifToken = existingTokens[0];

        if (!verifToken) {
            return { success: false, error: "Invalid Link or Expired Token" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db
            .update(users)
            .set({ password: hashedPassword, emailVerified: new Date() })
            .where(eq(users.id, verifToken.userId));

        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.userId, verifToken.userId));

        return { success: true, message: "Password reset successfully" };
    } catch (error: any) {
        console.error("Reset password error:", error);
        return { success: false, error: "Internal server error" };
    }
}
