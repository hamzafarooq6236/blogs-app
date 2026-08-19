"use client"

import { getBlogBySlugAction, updateBlogAction } from "@/actions/blogs";
import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit3 } from "lucide-react";

export default function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    
    const [enabled, setEnabled] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await getBlogBySlugAction(slug);

                if (!res.success || !res.data) {
                    throw new Error(res.error || "Failed to fetch blog");
                }

                setTitle(res.data.title ?? "");
                setContent(res.data.content ?? null);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    async function handleUpdate(status: string) {

        if (!title.trim()) {
            alert("Title is required!");
            return;
        }
        if (status === "publish") {
            if (enabled === true) {
                status = "public"
            } else {
                status = "private"
            }
        }
        setSaving(true);
        try {
            const serializedContent = JSON.parse(JSON.stringify(content))
            const res = await updateBlogAction(slug, { title, content:serializedContent, status });

            if (!res.success) {
                throw new Error(res.error || "Failed to update blog");
            }

            router.push(`/blogs/${slug}`);
        } catch (err: any) {
            console.error("Error updating blog:", err);
            alert(err.message || "Failed to update blog post");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="flex justify-center p-6 text-slate-600 font-sans">Loading blog details...</div>;
    }

    if (error) {
        return <div className="flex justify-center p-6 text-red-500 font-sans">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto py-10 px-6 font-sans">
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center bg-white/70 border border-[#CBF1F5] rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-[#A6E3E9]/20">
                <div className="flex items-center space-x-3 px-2">
                    <Switch className="cursor-pointer data-[state=checked]:bg-[#71C9CE]" id="public-mode" checked={enabled} onClick={()=>setEnabled(!enabled)}/>
                    <Label htmlFor="public-mode" className="font-semibold text-slate-700 cursor-pointer">Public Post</Label>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.back()} disabled={saving} className="border-[#A6E3E9] text-slate-600 hover:bg-[#CBF1F5]/30 rounded-xl transition-all">
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={() => handleUpdate("draft")} disabled={saving} className="bg-[#CBF1F5] text-[#3b9ea4] hover:bg-[#A6E3E9] rounded-xl transition-all font-semibold hover:text-white">
                        Save Draft
                    </Button>
                    <Button onClick={() => handleUpdate("publish")} disabled={saving} className="bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all font-semibold">
                        {saving ? "Saving..." : "Publish"}
                    </Button>
                </div>
            </div>

            <div className="bg-white/70 border border-[#CBF1F5] rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-xl shadow-[#A6E3E9]/20 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#A6E3E9]/40 pb-6">
                    <div className="p-3 bg-[#CBF1F5] rounded-xl text-[#71C9CE] shrink-0 w-fit">
                        <Edit3 className="w-6 h-6" />
                    </div>
                    <input
                        className="w-full bg-transparent text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 focus:outline-none tracking-tight"
                        type="text"
                        placeholder="Enter your amazing title..."
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                
                <div className="min-h-[500px]">
                    <Tiptap
                        mode="edit"
                        content={content}
                        onChange={(json) => setContent(json)}
                    />
                </div>
            </div>
        </div>
    );
}
