"use client"
import Tiptap from "@/components/editor/tiptap";
import { JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";

export default function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);

    useEffect(() => {
        async function edit() {
            try {
                const { slug } = await params;
                const res = await fetch(`/api/blogs/${slug}/edit`, {
                    method: "GET",
                })
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch blog");
                }

                setTitle(data.title ?? "");
                setContent(data.content);
            } catch (error) {
                console.error(error);
            }
        }
    }, [])
    return (
        <div>
            <Tiptap mode="edit" content={content} />
        </div>
    )
}
