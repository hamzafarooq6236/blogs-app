"use client"

import { Trash2, Pencil } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BlogProps {
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export default function Blog({ title, slug, createdAt, updatedAt }: BlogProps) {
    const router = useRouter();
    console.log(new Date(createdAt))

    async function handleDelete() {
        const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/blogs/${slug}/delete`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete blog");
            }

            router.refresh();
        } catch (error: any) {
            console.error("Error deleting blog:", error);
            alert(error.message || "Failed to delete blog post");
        }
    }

    return (
        <div className="flex flex-col bg-emerald-100 w-[40vw] gap-1 border-2 border-emerald-500 rounded-2xl px-3 pt-3 pb-1">
            <div className="flex items-center ">
                <div className="flex-1 min-w-0">
                    <Link href={`/blogs/${slug}`} className="hover:text-blue-400 hover:underline hover:underline-offset-3">
                        {title}
                    </Link>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        onClick={handleDelete}
                        title="Delete blog"
                    >
                        <Trash2 className="text-black h-4 w-4 cursor-pointer hover:text-red-600 transition-colors" />
                    </button>
                    <Link href={`/blogs/${slug}/edit`} title="Edit blog">
                        <Pencil className="shrink-0 ml-auto h-4 w-4 cursor-pointer text-black" />
                    </Link>
                </div>
            </div>
            <p className="text-cyan-700 text-xs self-end">Created: {new Date(createdAt).toLocaleString()} Updated: {new Date(updatedAt).toLocaleString() }</p>
        </div>
    );
}
