import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full min-h-screen max-w-md p-4 border border-gray-200 rounded-md shadow animate-pulse">
            {/* Circle Placeholder (Avatar) */}
            <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 py-1 space-y-4">
                    {/* Title Line Placeholder */}
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="space-y-2">
                        {/* Body Line Placeholders */}
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}