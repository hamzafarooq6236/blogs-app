"use client"

import { use, useEffect, useState } from "react";
import Tiptap from "@/components/editor/tiptap";
import { JSONContent } from "@tiptap/react";

export default function ReadBlog({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blogs/${slug}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch blog");
                }

                setTitle(data.title ?? "");
                setContent(data.content);
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

    if (loading) {
        return <div className="flex justify-center p-4">Loading blog...</div>;
    }

    if (error) {
        return <div className="flex justify-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            <Tiptap mode="view" content={content} />
        </div>
    );
}
