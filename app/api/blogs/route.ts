import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import slugify from "slugify"

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

        return Response.json({ data: userBlogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return Response.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}


export async function POST(request: Request) {

    try {
        const session = await auth();
        console.log(session)
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;
        const req = await request.json();
        console.log(req);
        const { title, content, status } = req;

        const id = randomUUID();

        const baseSlug = slugify(title, {
            lower: true,
            strict: true,
        });
        const slug = `${baseSlug}-${id}`;
        const publishedAt = status === "draft" ? null : new Date();

        const [blog] = await db.insert(blogs).values({
            userId,
            id,
            title,
            slug,
            content,
            status,
            publishedAt,
        }).returning();

        return Response.json(blog);
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to create blog post" }, { status: 500 });
    }
}