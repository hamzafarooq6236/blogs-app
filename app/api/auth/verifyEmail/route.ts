import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { redirect } from "next/navigation";

export async function POST(request:Request){
    const {token} = await request.json();

    if(!token){
        return Response.json({message:"token missing"},{status:403});
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const existingUsers = await db.select().from(users).where(eq(users.verificationToken,hashedToken)).limit(1);
    const user = existingUsers[0];
    if(!user){
        return Response.json({message:"Invalid Link"},{status:401});
    }

    await db.update(users).set({verificationToken:null, emailVerified: new Date()}).where(eq(users.email,user.email));
    // redirect("/auth/signin")
    return Response.json({message:"Account Verified"},{status:200});
    
}