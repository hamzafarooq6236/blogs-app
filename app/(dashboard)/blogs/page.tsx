import Blog from "@/components/blog/blog";
import { getBlogsAction } from "@/actions/blogs";
import { JSONContent } from "@tiptap/react";
import { BookOpen } from "lucide-react";
import Link from "next/link";

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
        <div className="min-h-[calc(100vh-3rem)] w-full relative overflow-hidden font-sans p-6 sm:p-10">
            {/* Subtle Background Elements matching landing page */}
            {/* <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div> */}
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40 pointer-events-none z-0"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Blogs</h1>
                        <p className="text-slate-500 mt-2 text-sm font-medium">Manage and organize all your written content.</p>
                    </div>
                    <Link href="/blogs/new" className="px-5 py-3 bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all font-semibold text-sm flex items-center justify-center shrink-0">
                        Write New Blog
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {result?.data && result.data.length > 0 ? (
                        result.data.map((blogItem) => (
                            <Blog
                                key={blogItem.id}
                                title={blogItem.title ?? "Untitled"}
                                slug={blogItem.slug}
                                createdAt={blogItem.createdAt as any}
                                updatedAt={blogItem.updatedAt as any}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white/60 rounded-3xl border border-[#CBF1F5] backdrop-blur-xl shadow-sm">
                            <div className="w-16 h-16 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71C9CE]">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-bold text-slate-800 mb-1">No blogs found.</p>
                            <p className="text-slate-500 text-sm">It looks like you haven't written any blogs yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
