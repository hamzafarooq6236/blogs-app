import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full min-h-screen bg-[#E3FDFD] flex flex-col font-sans">
            {/* Navbar Skeleton */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#E3FDFD]/80 border-b border-[#A6E3E9]/40 w-full animate-pulse">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#CBF1F5] rounded-xl"></div>
                        <div className="w-24 h-6 bg-[#A6E3E9] rounded-md"></div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-4 bg-[#CBF1F5] rounded-md hidden sm:block"></div>
                        <div className="w-16 h-4 bg-[#CBF1F5] rounded-md hidden sm:block"></div>
                        <div className="w-28 h-10 bg-[#A6E3E9] rounded-xl"></div>
                    </div>
                </div>
            </header>

            {/* Content Skeleton */}
            <div className="flex-1 p-8 sm:px-6 lg:px-8 mt-4">
                <div className="max-w-5xl mx-auto w-full p-6 bg-white/40 border border-[#CBF1F5] rounded-3xl shadow-sm animate-pulse">
                    {/* Circle Placeholder (Avatar) */}
                    <div className="flex space-x-6">
                        <div className="w-12 h-12 bg-[#A6E3E9] rounded-2xl"></div>
                        <div className="flex-1 py-1 space-y-5">
                            {/* Title Line Placeholder */}
                            <div className="h-16 bg-[#A6E3E9] rounded-md w-1/3"></div>
                            <div className="space-y-3">
                                {/* Body Line Placeholders */}
                                <div className="h-4 bg-[#CBF1F5] rounded w-full"></div>
                                <div className="h-4 bg-[#CBF1F5] rounded w-5/6"></div>
                                <div className="h-4 bg-[#CBF1F5] rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}