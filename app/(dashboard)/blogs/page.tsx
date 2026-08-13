import Blog from "@/components/blog/blog";
import { getBlogsAction } from "@/actions/blogs";
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
    publishedAt: number | string | null;
}

export default async function BlogsPage() {
    const result = await getBlogsAction();

    return (
        <div className="flex flex-col items-center gap-4">
            <p>My Blogs</p>
            {result?.data && result.data.length > 0 ? (
                result.data.map((blogItem) => (

                    <Blog
                        key={blogItem.id}
                        title={blogItem.title ?? "Untitled"}
                        slug={blogItem.slug}
                        createdAt={blogItem.createdAt}
                        updatedAt={blogItem.updatedAt}

                    />
                ))
            ) : (
                <p>No blogs found.</p>
            )}
        </div>
    );
}
