'use cache'
import { getPublicBlogBySlugAction } from "@/actions/blogs";
import Tiptap from "@/components/editor/tiptap";
import { notFound } from "next/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cacheLife } from "next/cache";

export default async function PublicBlogPage({ params }: { params: Promise<{ slug: string }> }) {

    cacheLife('minutes')
    const { slug } = await params;
    const res = await getPublicBlogBySlugAction(slug);
    if (!res.success || !res.data) {
        notFound();
    }

    const blog = res.data;

    return (
        <div className="min-h-screen bg-[#E3FDFD] font-sans relative">
            {/* Subtle Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#adecf3] rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#adecf3] rounded-full blur-3xl opacity-40"></div>
            </div>

            <main className="max-w-4xl mx-auto py-8 px-6 relative z-10">
                <Link
                    href="/public/blogs"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#71C9CE] transition-colors mb-10 font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Public Blogs
                </Link>

                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mb-6 text-[#71C9CE] shadow-sm">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    {blog.title && (
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {blog.title}
                        </h1>
                    )}
                </div>

                <div className="bg-white/80 border border-[#CBF1F5] rounded-[2rem] sm:p-12 backdrop-blur-md shadow-xl shadow-[#A6E3E9]/20 prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-[#71C9CE] hover:prose-a:text-[#5bb8bd]">
                    <Tiptap
                        mode="view"
                        content={blog.content}
                    />
                </div>
            </main>
        </div>
    );
}

