import Blog from "@/components/blog/blog";
import { JSONContent } from "@tiptap/react";
import { headers } from "next/headers";

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
    publishedAt: number | string | null;
}

export default async function BlogsPage() {

    const res = await fetch("http://localhost:3000/api/blogs", {
        headers: {
            cookie: (await headers()).get("cookie") ?? "",
        }
    });
    const result = await res.json();
    console.log(result);

    return (
        <div className="flex flex-col items-center gap-4">
            <p>My Blogs</p>
            {result?.data && result.data.length > 0 ? (
                result.data.map((blogItem: BlogItem) => (

                    <Blog
                        key={blogItem.id}
                        title={blogItem.title ?? "Untitled"}
                        slug={blogItem.slug}
                        createdAt={blogItem.createdAt}
                        publishedAt={blogItem.publishedAt}

                    />
                ))
            ) : (
                <p>No blogs found.</p>
            )}
        </div>
    );
}
