"use client"
import { createBlogAction } from "@/actions/blogs";
import Tiptap from "@/components/editor/tiptap";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export default function NewBlogPage() {
    const [enabled, setEnabled] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);

    async function save(status: string) {
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
        const serializedContent = JSON.parse(JSON.stringify(content));
        const res = await createBlogAction({
            title,
            content: serializedContent,
            status,
        });

        if (res.success && res.data?.slug) {
            router.push(`/blogs/${res.data.slug}`);
        } else if (res.success) {
            router.push("/dashboard");
        } else {
            alert(res.error || "Failed to save post");
        }
    }

    return (
        <div className="min-h-[calc(100vh-3rem)] w-full relative overflow-hidden font-sans p-6 sm:p-10">
            {/* Subtle Background Elements matching landing page */}
            {/* <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div> */}
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40 pointer-events-none z-0"></div>

            <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-6">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/60 border border-[#CBF1F5] rounded-3xl p-5 sm:px-8 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#CBF1F5] rounded-xl flex items-center justify-center text-[#71C9CE] shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <strong className="text-xl font-bold text-slate-800 tracking-tight">Add New Post</strong>
                            <p className="text-xs text-slate-500 font-medium">Create a new blog</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-xl border border-[#A6E3E9]">
                            <Switch className="cursor-pointer data-[state=checked]:bg-[#71C9CE]" id="airplane-mode" onCheckedChange={setEnabled} onClick={() => setEnabled(!enabled)} />
                            <Label htmlFor="airplane-mode" className="text-sm font-medium text-slate-700 cursor-pointer">Public</Label>
                        </div>
                        <Button className="bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all font-semibold" onClick={() => save("publish")}>Publish</Button>
                        <Button variant="outline" className="rounded-xl border-[#A6E3E9] text-slate-700 hover:bg-[#CBF1F5]/30" onClick={() => save("draft")}>Save Draft</Button>
                        <Button variant="destructive" className="rounded-xl" onClick={() => router.push("/dashboard")}>Discard</Button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="bg-white/60 border border-[#CBF1F5] rounded-3xl p-6 sm:p-10 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl flex flex-col gap-8 min-h-[600px]">
                    <input
                        className="w-full bg-transparent text-4xl sm:text-5xl font-extrabold text-slate-800 placeholder:text-slate-300 outline-none border-b border-transparent focus:border-[#CBF1F5] pb-2 transition-colors"
                        type="text"
                        placeholder="Enter title here"
                        required
                        autoFocus
                        onChange={(e) => { setTitle(e.target.value) }}
                    />

                    <div className="flex-1 w-full text-slate-800">
                        <Tiptap mode="edit" onChange={(json) => {
                            setContent(json);
                        }} />
                    </div>
                </div>
            </div>
        </div>
    )
}