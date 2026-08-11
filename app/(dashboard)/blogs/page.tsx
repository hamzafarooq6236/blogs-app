"use client"
import Blog from "@/components/blog/blog";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";

interface BlogItem {
    id: string;
    userId: string;
    title: string | null;
    slug: string;
    coverImagePath: string | null;
    content: JSONContent | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

interface BlogsResponse {
    data: BlogItem[];
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getBlogs() {
            try {
                const res = await fetch("/api/blogs", {
                    method: "GET",
                });
                const result = await res.json();
                console.log(result);
                if (res.ok) {
                    setBlogs(result);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        }

        getBlogs();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <p>My Blogs</p>
            {blogs?.data && blogs.data.length > 0 ? (
                blogs.data.map((blogItem) => (
                    <Blog
                        key={blogItem.id}
                        title={blogItem.title ?? "Untitled"}
                        content={blogItem.content ?? {}}
                    />
                ))
            ) : (
                <p>No blogs found.</p>
            )}
        </div>
    );
}
