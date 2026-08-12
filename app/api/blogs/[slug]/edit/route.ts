import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;

        if (!slug) {
            return Response.json({ error: "Slug is required" }, { status: 400 });
        }

        const [blog] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)));

        if (!blog) {
            return Response.json({ error: "Blog not found" }, { status: 404 });
        }

        return Response.json(blog);
    } catch (error) {
        console.error("Error fetching blog for edit:", error);
        return Response.json({ error: "Failed to fetch blog post" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;

        if (!slug) {
            return Response.json({ error: "Slug is required" }, { status: 400 });
        }

        const req = await request.json();
        const { title, content, status } = req;

        const [existingBlog] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)));

        if (!existingBlog) {
            return Response.json({ error: "Blog not found or unauthorized" }, { status: 404 });
        }

        const [updatedBlog] = await db
            .update(blogs)
            .set({
                title,
                content,
                status: status || existingBlog.status,
                updatedAt: new Date(),
                ...(status && status !== "draft" && !existingBlog.publishedAt
                    ? { publishedAt: new Date() }
                    : {}),
            })
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)))
            .returning();

        return Response.json(updatedBlog);
    } catch (error) {
        console.error("Error updating blog:", error);
        return Response.json({ error: "Failed to update blog post" }, { status: 500 });
    }
}
