import { getPublicBlogBySlugAction } from "@/actions/blogs";
import Tiptap from "@/components/editor/tiptap";
import { notFound } from "next/navigation";

export default async function PublicBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } =await params;
    const res = await getPublicBlogBySlugAction(slug);
    console.log(res)
    if (!res.success || !res.data) {
        notFound();
    }

    const blog = res.data;

    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch blog");
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {blog.title && (
                <h1 className="text-3xl font-bold">
                    {blog.title}
                </h1>
            )}

            <Tiptap
                mode="view"
                content={blog.content ?? ""}
            />
        </div>
    );
}

