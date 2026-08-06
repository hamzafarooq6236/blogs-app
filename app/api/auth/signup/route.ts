import { SignupFormSchema } from "@/lib/definitions";
import { users } from "@/db/schema";
import { db } from "@/db/index";
import sgMail from "@sendgrid/mail";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log(data);

        //validate data using zod
        const validateData = SignupFormSchema.safeParse({
            email: data.email,
            password: data.password,
        });

        if (!validateData.success) {
            return Response.json(
                { errors: validateData.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        //check if user already exists
        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, validateData.data.email));

        if (existingUsers.length > 0) {
            return Response.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }



        // Generate a UUID for the user so tokens can be created before database insertion
        const userId = crypto.randomUUID();

        // Hash password
        const hashedPassword = await bcrypt.hash(validateData.data.password, 10);
        const token = crypto.randomBytes(32).toString("hex");
        const verifyLink = `http://localhost:3000/auth/verifyEmail?token=${token}`;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Create and save new user
        const [newUser] = await db
            .insert(users)
            .values({
                id: userId,
                name: data.fullName,
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
            throw new Error("SEND_GRID_API_KEY has not been setup in environmental variables.");
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: newUser.email,
            from: 'hamzafarooq109@gmail.com',
            subject: "Your Password Reset OTP",
            text: 'Hello plain world!',
            html : `
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

<table role="presentation" width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;padding:40px;">

<tr>
<td align="center">

<h1 style="margin:0;color:#2563eb;">
YourApp
</h1>

<p style="margin-top:10px;color:#6b7280;font-size:15px;">
Verify Your Email Address
</p>

</td>
</tr>

<tr>
<td style="padding-top:30px;color:#374151;font-size:16px;line-height:28px;">

Hello,

<br><br>

Thank you for creating an account with <strong>YourApp</strong>.

To activate your account, please verify your email address by clicking the button below.

</td>
</tr>

<tr>
<td align="center" style="padding:35px 0;">

<a
href="${verifyLink}"
style="
display:inline-block;
background:#2563eb;
color:#ffffff;
padding:16px 36px;
text-decoration:none;
font-size:16px;
font-weight:bold;
border-radius:8px;
">

Verify Email

</a>

</td>
</tr>

<tr>
<td style="color:#374151;font-size:15px;line-height:24px;">

This verification link will expire in
<strong>24 hours</strong>.

</td>
</tr>

<tr>
<td style="padding-top:25px;color:#6b7280;font-size:14px;line-height:24px;">

If the button above doesn't work, copy and paste the following link into your browser:

<br><br>

<a href="${verifyLink}" style="color:#2563eb;word-break:break-all;">
${verifyLink}
</a>

</td>
</tr>

<tr>
<td style="padding-top:25px;color:#6b7280;font-size:14px;line-height:24px;">

If you didn't create an account with <strong>YourApp</strong>, you can safely ignore this email. No account will be activated unless the verification link is used.

</td>
</tr>

<tr>
<td style="padding-top:40px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:13px;">

This is an automated email from <strong>YourApp</strong>.<br>
Please do not reply to this email.

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
        };
        await sgMail.send(msg);
        return Response.json({ message: "verification email has been sent to your email. Check your Email" }, { status: 200 });

    } catch (error) {
        console.error("Signup error:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

