"use client"

import { useState } from "react";
import { X,Loader2 } from "lucide-react";

interface TopicPromptProps {
    generateContent?: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
    onClose?: () => void;
}

export default function TopicPrompt({ generateContent, onClose }: TopicPromptProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!generateContent) return;
        setLoading(true);
        try {
            await generateContent(e);
        } catch (error) {
            console.error("Failed to generate content:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute p-6 z-20 bg-[#71c9ce] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out shadow-2xl rounded-2xl md:w-80 border border-white/40">
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="absolute top-3 right-3 text-slate-700 hover:text-black hover:bg-black/10 rounded-full p-1 transition-colors cursor-pointer disabled:opacity-50"
                aria-label="Close popup"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col justify-center items-center">
                <h3 className="font-semibold text-slate-800 text-lg">Generate AI Content</h3>

                <form onSubmit={handleSubmit} className="flex flex-col mt-4 w-full">
                    <label htmlFor="prompt" className="text-sm font-medium text-slate-700 mb-1">Write a topic:</label>
                    <input
                        name="topic"
                        id="prompt"
                        disabled={loading}
                        minLength={5}
                        placeholder="e.g. Benefits of Next.js 15"
                        className="border border-white/60 bg-white/90 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-700/20 w-full shadow-inner disabled:opacity-60" 
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-1.5 px-4 rounded-xl mt-3 self-end shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </form>
            </div>
        </div>
    );
}
