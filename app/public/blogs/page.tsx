"use cache"
import { getPublicBlogsAction } from "@/actions/blogs";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";

export default async function PublicBlogsPage() {
    cacheLife("seconds")
    const result = await getPublicBlogsAction();
    const blogs = result.success ? result.data : [];

    return (
        <div className="min-h-screen bg-[#E3FDFD] text-slate-800 flex flex-col selection:bg-[#71C9CE] selection:text-white font-sans relative">
            {/* Subtle Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 w-full z-10 relative">
                <Link 
                    href="/"
                    className="font-bold inline-flex items-center gap-2 text-slate-500 hover:text-[#263c3d] transition-colors mb-10 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBF1F5]/60 border border-[#A6E3E9] text-[#71C9CE] text-xs font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Community</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                        Public <span className="text-[#4f9093]">Blogs</span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                        Read the latest articles published by our amazing community of writers and thinkers.
                    </p>
                </div>
                
                {result.error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl mb-12 text-center text-sm font-medium shadow-sm">
                        {result.error}
                    </div>
                )}

                {!result.error && blogs.length === 0 && (
                    <div className="text-center text-slate-500 py-16 bg-white/60 rounded-[2rem] shadow-sm shadow-[#A6E3E9]/10 border border-[#CBF1F5] backdrop-blur-md">
                        <div className="w-16 h-16 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71C9CE]">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <p className="text-lg">No public blogs available at the moment.</p>
                        <p className="text-sm mt-2 text-slate-400">Be the first to publish one!</p>
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white/70 overflow-hidden shadow-sm shadow-[#A6E3E9]/10 rounded-3xl border border-[#CBF1F5] hover:border-[#A6E3E9] hover:bg-white transition-all backdrop-blur-md hover:shadow-xl hover:shadow-[#A6E3E9]/20 flex flex-col group transform hover:-translate-y-1 duration-300">
                            <div className="p-8 grow flex flex-col">
                                <h3 className="text-2xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-[#71C9CE] transition-colors">
                                    {blog.title}
                                </h3>
                                {/* {!!blog.content && (
                                    <div className="text-slate-600 line-clamp-3 mb-6 grow font-light text-sm leading-relaxed">
                                        <p>{blog.content}</p>
                                    </div>
                                )} */}
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#A6E3E9]/30">
                                    <span className="text-sm font-medium text-slate-500 bg-[#CBF1F5]/50 px-3 py-1.5 rounded-full">
                                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '')}
                                    </span>
                                    <Link 
                                        href={`/public/blogs/${blog.slug}`} 
                                        className="inline-flex items-center gap-1.5 text-[#71C9CE] hover:text-[#5bb8bd] font-semibold text-sm transition-colors"
                                    >
                                        Read post <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
