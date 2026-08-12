"use client"

import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blogs/${slug}/edit`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch blog");
                }

                setTitle(data.title ?? "");
                setContent(data.content ?? null);
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

    async function handleUpdate(status: "draft" | "public" = "public") {
        setSaving(true);
        try {
            const res = await fetch(`/api/blogs/${slug}/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, status }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update blog");
            }

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Error updating blog:", err);
            alert(err.message || "Failed to update blog post");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="flex justify-center p-6 text-slate-600">Loading blog details...</div>;
    }

    if (error) {
        return <div className="flex justify-center p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-2 w-[70vw] mx-auto p-3">
            <div className="flex gap-2 justify-end flex-wrap">
                <Button onClick={() => handleUpdate("public")} disabled={saving}>
                    {saving ? "Saving..." : "Publish"}
                </Button>
                <Button variant="outline" onClick={() => handleUpdate("draft")} disabled={saving}>
                    Save Draft
                </Button>
                <Button variant="destructive" onClick={() => router.back()} disabled={saving}>
                    Cancel
                </Button>
            </div>
            <div>
                <strong className="text-2xl font-['Arial',sans-serif]">
                    Edit Post
                </strong>
                <input
                    className="w-full border-2 border-slate-50 p-2 text-xl font-medium focus:outline-none focus:border-slate-300"
                    type="text"
                    placeholder="Enter title here"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <Tiptap
                    mode="edit"
                    content={content}
                    onChange={(json) => setContent(json)}
                />
            </div>
        </div>
    );
}
