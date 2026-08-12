import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

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
            .where(and(eq(blogs.slug, slug),eq(blogs.userId,session.user.id)));

        if (!blog) {
            return Response.json({ error: "Blog not found" }, { status: 404 });
        }

        return Response.json(blog);
    } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return Response.json({ error: "Failed to fetch blog post" }, { status: 500 });
    }
}
