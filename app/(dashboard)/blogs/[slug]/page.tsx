import { getBlogBySlugAction } from "@/actions/blogs";
import Tiptap from "@/components/editor/tiptap";

export default async function ReadBlog({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const res = await getBlogBySlugAction(slug);

    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch blog");
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {res.data.title && (
                <h1 className="text-3xl font-bold">
                    {res.data.title}
                </h1>
            )}

            <Tiptap
                mode="view"
                content={res.data.content ?? ""}
            />
        </div>
    );
}