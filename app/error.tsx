"use client" // Error boundaries must be Client Components

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Subtle Background Elements */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60"></div>
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40"></div>

            <div className="max-w-md w-full bg-white/60 border border-[#CBF1F5] rounded-[2rem] p-10 text-center shadow-xl shadow-[#A6E3E9]/20 backdrop-blur-xl z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#CBF1F5]/50 text-[#71C9CE] rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Oops! Something went wrong</h2>
                
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all font-semibold transform hover:-translate-y-0.5"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </button>
                    
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-[#CBF1F5]/50 text-slate-700 border border-[#A6E3E9] rounded-xl transition-all font-medium"
                    >
                        <Home className="w-4 h-4 text-slate-500" />
                        Go to Homepage
                    </Link>
                </div>
                
                {/* Optional dev/debug info hidden gracefully */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-3 bg-red-50/50 rounded-lg border border-red-100 w-full text-left">
                        <p className="text-xs text-red-400 font-mono wrap-break-word">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
