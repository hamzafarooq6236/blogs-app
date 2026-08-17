"use client"

import { deleteBlogAction } from "@/actions/blogs";
import { Trash2, Pencil } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BlogProps {
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function Blog({ title, slug, createdAt, updatedAt }: BlogProps) {
    const router = useRouter();
    console.log(new Date(createdAt))

    async function handleDelete() {
        const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmed) return;

        try {
            const res = await deleteBlogAction(slug);

            if (!res.success) {
                throw new Error(res.error || "Failed to delete blog");
            }

            router.refresh();
        } catch (error: any) {
            console.error("Error deleting blog:", error);
            alert(error.message || "Failed to delete blog post");
        }
    }

    return (
        <div className="flex flex-col sm:flex-row bg-white/60 w-full gap-4 sm:items-center justify-between border border-[#CBF1F5] rounded-3xl p-5 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl hover:shadow-md hover:border-[#A6E3E9] transition-all group">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <Link href={`/blogs/${slug}`} className="text-xl font-bold text-slate-800 hover:text-[#71C9CE] transition-colors line-clamp-1 w-fit">
                    {title}
                </Link>
                <div className="flex flex-wrap gap-2">
                    <p className="text-slate-500 text-xs font-medium bg-[#CBF1F5]/50 px-3 py-1 rounded-full w-fit">
                        Created: {new Date(createdAt).toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-xs font-medium bg-[#CBF1F5]/50 px-3 py-1 rounded-full w-fit">
                        Updated: {new Date(updatedAt).toLocaleString()}
                    </p>
                </div>
            </div>
            
            <div className="flex gap-2 items-center bg-[#CBF1F5]/30 p-1.5 rounded-xl transition-opacity shrink-0 self-start sm:self-auto">
                <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete blog"
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-400"
                >
                    <Trash2 className="h-4 w-4 cursor-pointer" />
                </button>
                <Link href={`/blogs/${slug}/edit`} title="Edit blog" className="p-2 hover:bg-[#CBF1F5] rounded-lg transition-colors text-[#71C9CE]">
                    <Pencil className="h-4 w-4 cursor-pointer" />
                </Link>
            </div>
        </div>
    );
}
