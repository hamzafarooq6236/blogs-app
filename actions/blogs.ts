"use server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, desc, count } from "drizzle-orm";
import { randomUUID } from "crypto";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { JSONContent } from "@tiptap/react";
import { gemini } from "@/lib/ai/gemini";
import { redirect } from "next/navigation";

export async function getBlogsAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", data: [] };
        }

        const userBlogs = await db
            .select()
            .from(blogs)
            .where(eq(blogs.userId, session.user.id))
            .orderBy(desc(blogs.createdAt));

        return { success: true, data: userBlogs };
    } catch (error: any) {
        console.error("Error fetching blogs action:", error);
        return { success: false, error: error.message || "Failed to fetch blogs", data: [] };
    }
}

export async function createBlogAction(data: { title: string; content: JSONContent | null; status?: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }
        const userId = session.user.id;
        const { title, content, status } = data;

        if (!title) {
            return { success: false, error: "Title is required" };
        }

        const id = randomUUID();
        const baseSlug = slugify(title, { lower: true, strict: true });
        const slug = `${baseSlug}-${id}`;
        const publishedAt = status === "draft" ? null : new Date();

        const [blog] = await db
            .insert(blogs)
            .values({
                userId,
                id,
                title,
                slug,
                content,
                status: status || "draft",
                publishedAt,
            })
            .returning();

        revalidatePath("/blogs");
        return { success: true, data: blog };
    } catch (error: any) {
        console.error("Error creating blog action:", error);
        return { success: false, error: error.message || "Failed to create blog post" };
    }
}

export async function getBlogBySlugAction(slug: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", data: null };
        }

        if (!slug) {
            return { success: false, error: "Slug is required", data: null };
        }

        const [blog] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)));

        if (!blog) {
            return { success: false, error: "Blog not found", data: null };
        }

        return { success: true, data: blog };
    } catch (error: any) {
        console.error("Error fetching blog by slug action:", error);
        return { success: false, error: error.message || "Failed to fetch blog post", data: null };
    }
}

export async function updateBlogAction(
    slug: string,
    data: { title?: string; content?: any; status?: string }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        if (!slug) {
            return { success: false, error: "Slug is required" };
        }

        const [existingBlog] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)));

        if (!existingBlog) {
            return { success: false, error: "Blog not found or unauthorized" };
        }

        const { title, content, status } = data;

        const [updatedBlog] = await db
            .update(blogs)
            .set({
                title: title !== undefined ? title : existingBlog.title,
                content: content !== undefined ? content : existingBlog.content,
                status: status || existingBlog.status,
                updatedAt: new Date(),
                ...(status && status !== "draft" && !existingBlog.publishedAt
                    ? { publishedAt: new Date() }
                    : {}),
            })
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)))
            .returning();

        revalidatePath("/blogs");
        revalidatePath(`/blogs/${slug}`);
        return { success: true, data: updatedBlog };
    } catch (error: any) {
        console.error("Error updating blog action:", error);
        return { success: false, error: error.message || "Failed to update blog post" };
    }
}

export async function deleteBlogAction(slug: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        if (!slug) {
            return { success: false, error: "Slug is required" };
        }

        const [deletedBlog] = await db
            .delete(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.userId, session.user.id)))
            .returning();

        if (!deletedBlog) {
            return { success: false, error: "Blog not found or unauthorized" };
        }

        revalidatePath("/blogs");
        return { success: true, message: "Blog deleted successfully", data: deletedBlog };
    } catch (error: any) {
        console.error("Error deleting blog action:", error);
        return { success: false, error: error.message || "Failed to delete blog post" };
    }
}

export async function getDashboardStatsAction() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/")
    }
    try {

        const userId = session.user.id;

        const userBlogs = await db
            .select({
                status: blogs.status,
                count: count(),
            })
            .from(blogs)
            .where(eq(blogs.userId, userId))
            .groupBy(blogs.status);

        let total = 0;
        let draft = 0;
        let publicCount = 0;
        let privateCount = 0;

        for (const item of userBlogs) {
            const cnt = Number(item.count);
            total += cnt;
            if (item.status === "draft") draft = cnt;
            else if (item.status === "public") publicCount = cnt;
            else if (item.status === "private") privateCount = cnt;
        }

        return {
            success: true,
            stats: {
                total,
                draft,
                public: publicCount,
                private: privateCount,
            },
        };
    } catch (error: any) {
        console.error("Error fetching dashboard stats action:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch dashboard data",
            stats: { total: 0, draft: 0, public: 0, private: 0 },
        };
    }
}

export async function getPublicBlogsAction() {
    try {
        const publicBlogs = await db
            .select()
            .from(blogs)
            .where(eq(blogs.status, "public"))
            .orderBy(desc(blogs.createdAt));

        return { success: true, data: publicBlogs };
    } catch (error: any) {
        console.error("Error fetching public blogs action:", error);
        return { success: false, error: error.message || "Failed to fetch public blogs", data: [] };
    }
}

export async function getPublicBlogBySlugAction(slug: string) {
    try {
        if (!slug) {
            return { success: false, error: "Slug is required", data: null };
        }

        const [blog] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), eq(blogs.status, "public")));

        if (!blog) {
            return { success: false, error: "Blog not found", data: null };
        }

        return { success: true, data: blog };
    } catch (error: any) {
        console.error("Error fetching public blog by slug action:", error);
        return { success: false, error: error.message || "Failed to fetch public blog post", data: null };
    }
}

export async function getAIContentAction(topic: string): Promise<{ success: boolean; data?: JSONContent | null; title?: string; error?: string }> {
    try {


        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            system: `
You are an AI blog content generator.

Your task is to generate a concise blog article based on the user's topic.

Return the result as a structured JSON object with exactly these fields:

{
  "title": "string",
  "content": {
    // Return a valid Tiptap document.
  }
}


Allowed nodes:
- doc
- heading
- paragraph
- bulletList
- orderedList
- listItem
- text

Rules:
1. "title":
    - Generate a clear, engaging, SEO-friendly title.
    - Keep the title concise.
    - Do NOT include the title inside the Tiptap content.
2. "content":
    - Must be a valid Tiptap JSON document.
    - The root node must be:
    {
        "type": "doc",
        "content": [...]
    }
    - Maximum 100 words total.
    - Do not exceed 100 words.
    - Root must be type "doc".
    - Headings must have attrs.level.
    - Heading levels can only be 1, 2, or 3.
    - Paragraphs contain text nodes.
    - List items contain paragraphs.
    - Do not generate Markdown.
    - Do not generate HTML.
    - Do not generate images.
    - Do not add unknown node types.
    - Do not add unknown attributes.
Always return the title and Tiptap content as separate fields.
`,
            prompt: `Create a high-quality blog article about: ${topic}`

        });

        if (!text) {
            return { success: false, error: "No content was generated.", data: null };
        }

        const cleanedText = text.replace(/```json\n?|```/g, "").trim();
        const parsedContent = JSON.parse(cleanedText);
        const title:string = parsedContent.title;
        const tiptapDoc: JSONContent = parsedContent.content
        console.log(cleanedText)
        return { success: true, data: tiptapDoc, title: title };
    } catch (error: any) {
        console.error("Error generating AI Content:", error);
        return { success: false, error: error.message || "Error generating AI Content", data: null };
    }
}