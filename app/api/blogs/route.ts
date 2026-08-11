import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userBlogs = await db
            .select()
            .from(blogs)
            .where(eq(blogs.userId, session.user.id))
            .orderBy(desc(blogs.createdAt));

        return Response.json({data:userBlogs});
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return Response.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}
