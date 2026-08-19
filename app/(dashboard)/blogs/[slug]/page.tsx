import { getBlogBySlugAction } from "@/actions/blogs";
import Tiptap from "@/components/editor/tiptap";
import { BookOpen } from "lucide-react";

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
        <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
            <div className="mb-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mb-6 text-[#71C9CE] shadow-sm">
                    <BookOpen className="w-8 h-8" />
                </div>
                {res.data.title && (
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {res.data.title}
                    </h1>
                )}
            </div>

            <div className="bg-white/80 border border-[#CBF1F5] rounded-[2rem] p-8 sm:p-12 backdrop-blur-md shadow-xl shadow-[#A6E3E9]/20 prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-[#71C9CE] hover:prose-a:text-[#5bb8bd]">
                <Tiptap
                    mode="view"
                    content={res.data.content}
                />
            </div>
        </div>
    );
}