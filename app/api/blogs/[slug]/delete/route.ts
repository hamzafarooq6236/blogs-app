import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function DELETE(
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

        const [deletedBlog] = await db
            .delete(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)))
            .returning();

        if (!deletedBlog) {
            return Response.json({ error: "Blog not found or unauthorized" }, { status: 404 });
        }

        return Response.json({ message: "Blog deleted successfully", data: deletedBlog });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return Response.json({ error: "Failed to delete blog post" }, { status: 500 });
    }
}
