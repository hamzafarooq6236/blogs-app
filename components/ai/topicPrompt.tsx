"use client"

import { useState } from "react";
import { X, Loader2, Sparkles, Mic, FileText, Globe, Users, Pen, Key, MessageSquare } from "lucide-react";
import type { GenerateContentOptions } from "@/actions/blogs";

interface TopicPromptProps {
    generateContent?: (options: GenerateContentOptions) => Promise<void> | void;
    onClose?: () => void;
}

const TONES = ["Professional", "Casual", "Humorous", "Academic", "Storytelling", "Persuasive", "Inspirational"];
const LENGTHS = [
    { key: "short", label: "Short", desc: "~100 words" },
    { key: "medium", label: "Medium", desc: "~300 words" },
    { key: "long", label: "Long", desc: "~600 words" },
];
const LANGUAGES = ["English", "Urdu", "Spanish", "French", "German", "Arabic", "Chinese"];
const AUDIENCES = ["General", "Developers", "Beginners", "Business Professionals", "Students"];
const STYLES = ["Blog Post", "Tutorial", "Listicle", "Opinion Piece", "How-To Guide", "News Article"];

export default function TopicPrompt({ generateContent, onClose }: TopicPromptProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("Professional");
    const [length, setLength] = useState("medium");
    const [language, setLanguage] = useState("English");
    const [audience, setAudience] = useState("General");
    const [style, setStyle] = useState("Blog Post");
    const [keywords, setKeywords] = useState("");
    const [additionalInstructions, setAdditionalInstructions] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!generateContent || !topic || topic.trim().length < 5) return;
        setLoading(true);
        try {
            await generateContent({
                topic: topic.trim(),
                tone,
                length,
                language,
                audience,
                style,
                keywords: keywords.trim() || undefined,
                additionalInstructions: additionalInstructions.trim() || undefined,
            });
        } catch (error) {
            console.error("Failed to generate content:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 animate-in fade-in duration-200"
                onClick={!loading ? onClose : undefined}
            />

            {/* Modal */}
            <div className="fixed z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-xl max-h-[85vh] animate-in fade-in zoom-in-95 duration-300 ease-out">
                <div className="bg-white/80 backdrop-blur-2xl border border-[#CBF1F5] rounded-3xl shadow-2xl shadow-[#71C9CE]/20 flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#CBF1F5]/60">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] rounded-xl flex items-center justify-center shadow-sm">
                                <Sparkles className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base tracking-tight">Generate AI Content</h3>
                                <p className="text-xs text-slate-500">Customize your blog generation</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1.5 transition-all cursor-pointer disabled:opacity-50"
                            aria-label="Close popup"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                        <div className="overflow-y-auto px-6 py-4 space-y-5 flex-1">

                            {/* Topic Input */}
                            <Section icon={<Pen className="w-3.5 h-3.5" />} label="Topic" required>
                                <input
                                    name="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    disabled={loading}
                                    minLength={5}
                                    placeholder="e.g. Benefits of Next.js 15"
                                    className="w-full border border-[#CBF1F5] bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#71C9CE]/30 focus:border-[#71C9CE] transition-all shadow-sm disabled:opacity-60 placeholder:text-slate-400"
                                    required
                                    autoFocus
                                />
                            </Section>

                            {/* Tone */}
                            <Section icon={<Mic className="w-3.5 h-3.5" />} label="Tone">
                                <ChipGroup options={TONES} selected={tone} onChange={setTone} disabled={loading} />
                            </Section>

                            {/* Content Length */}
                            <Section icon={<FileText className="w-3.5 h-3.5" />} label="Content Length">
                                <div className="flex gap-2">
                                    {LENGTHS.map((l) => (
                                        <button
                                            type="button"
                                            key={l.key}
                                            disabled={loading}
                                            onClick={() => setLength(l.key)}
                                            className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all cursor-pointer disabled:opacity-50 ${
                                                length === l.key
                                                    ? "bg-[#71C9CE] text-white border-[#71C9CE] shadow-md shadow-[#71C9CE]/25"
                                                    : "bg-white border-[#CBF1F5] text-slate-600 hover:border-[#A6E3E9] hover:bg-[#CBF1F5]/20"
                                            }`}
                                        >
                                            <span className="block">{l.label}</span>
                                            <span className={`block text-xs mt-0.5 ${length === l.key ? "text-white/80" : "text-slate-400"}`}>{l.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </Section>

                            {/* Language */}
                            <Section icon={<Globe className="w-3.5 h-3.5" />} label="Language">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    disabled={loading}
                                    className="w-full border border-[#CBF1F5] bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#71C9CE]/30 focus:border-[#71C9CE] transition-all shadow-sm disabled:opacity-60 cursor-pointer appearance-none"
                                >
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </Section>

                            {/* Target Audience */}
                            <Section icon={<Users className="w-3.5 h-3.5" />} label="Target Audience">
                                <ChipGroup options={AUDIENCES} selected={audience} onChange={setAudience} disabled={loading} />
                            </Section>

                            {/* Writing Style */}
                            <Section icon={<FileText className="w-3.5 h-3.5" />} label="Writing Style">
                                <ChipGroup options={STYLES} selected={style} onChange={setStyle} disabled={loading} />
                            </Section>

                            {/* Keywords */}
                            <Section icon={<Key className="w-3.5 h-3.5" />} label="Keywords" optional>
                                <input
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    disabled={loading}
                                    placeholder="e.g. SEO, performance, server components"
                                    className="w-full border border-[#CBF1F5] bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#71C9CE]/30 focus:border-[#71C9CE] transition-all shadow-sm disabled:opacity-60 placeholder:text-slate-400"
                                />
                            </Section>

                            {/* Additional Instructions */}
                            {/* <Section icon={<MessageSquare className="w-3.5 h-3.5" />} label="Additional Instructions" optional>
                                <textarea
                                    value={additionalInstructions}
                                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                                    disabled={loading}
                                    placeholder="e.g. Include a call-to-action at the end, add code examples..."
                                    rows={2}
                                    className="w-full border border-[#CBF1F5] bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#71C9CE]/30 focus:border-[#71C9CE] transition-all shadow-sm disabled:opacity-60 placeholder:text-slate-400 resize-none"
                                />
                            </Section> */}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t rounded-b-2xl border-[#CBF1F5]/60 flex items-center justify-between gap-3 bg-white/50">
                        
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || topic.trim().length < 5}
                                    className="cursor-pointer bg-gradient-to-r from-[#71C9CE] to-[#5bb8bd] hover:from-[#5bb8bd] hover:to-[#4aa8ad] text-white text-sm font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-[#71C9CE]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <Sparkles className="w-4 h-4" />
                                    {loading ? "Generating..." : "Generate"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

/* ─── Reusable sub-components ──────────────────────────────────────── */

function Section({
    icon,
    label,
    required,
    optional,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    required?: boolean;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-[#71C9CE]">{icon}</span>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                {required && <span className="text-red-400 text-xs">*</span>}
                {optional && <span className="text-slate-400 text-xs font-normal">(optional)</span>}
            </div>
            {children}
        </div>
    );
}

function ChipGroup({
    options,
    selected,
    onChange,
    disabled,
}: {
    options: string[];
    selected: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <button
                    type="button"
                    key={option}
                    disabled={disabled}
                    onClick={() => onChange(option)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer disabled:opacity-50 ${
                        selected === option
                            ? "bg-[#71C9CE] text-white border-[#71C9CE] shadow-sm shadow-[#71C9CE]/25"
                            : "bg-white border-[#CBF1F5] text-slate-600 hover:border-[#A6E3E9] hover:bg-[#CBF1F5]/30"
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
