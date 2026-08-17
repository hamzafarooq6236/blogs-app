"use client";

import { verifyEmailAction } from "@/actions/auth";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function verify() {
            const token = searchParams.get("token");
            if (!token) {
                setError("Verification token missing. Please use the link sent to your email.");
                setIsLoading(false);
                return;
            }

            try {
                const res = await verifyEmailAction(token);

                if (res.success) {
                    setIsLoading(false);
                    // Redirect to signin after showing success message for 3 seconds
                    setTimeout(() => {
                        router.push("/auth/signin");
                    }, 3000);
                } else {
                    setError(res.error || "Verification failed");
                    setIsLoading(false);
                }
            } catch {
                setError("An unexpected error occurred during verification.");
                setIsLoading(false);
            }
        }

        verify();
    }, [router, searchParams]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center gap-4 text-[#71C9CE]">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="font-semibold tracking-wide animate-pulse text-slate-600">Verifying your account...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-16 h-16 bg-[#CBF1F5]/50 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-2 transform -rotate-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Verification Failed</h2>
                <p className="text-slate-500 text-sm text-center leading-relaxed">
                    {error}
                </p>
                <button
                    onClick={() => router.push("/auth/signin")}
                    className="mt-6 w-full py-3.5 bg-white hover:bg-[#CBF1F5]/30 text-slate-700 border border-[#A6E3E9] rounded-xl transition-all font-medium"
                >
                    Go to Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-16 h-16 bg-[#CBF1F5] text-[#71C9CE] rounded-3xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Account Verified!</h2>
            <p className="text-slate-500 text-sm text-center leading-relaxed">
                Your email has been successfully verified.
                <br />
                Redirecting you to sign in...
            </p>
            <div className="mt-4">
                <Loader2 className="w-6 h-6 text-[#71C9CE] animate-spin" />
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Subtle Background Elements */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60"></div>
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40"></div>

            <div className="max-w-md w-full bg-white/60 border border-[#CBF1F5] rounded-[2rem] p-10 text-center shadow-xl shadow-[#A6E3E9]/20 backdrop-blur-xl z-10 flex flex-col items-center justify-center min-h-[350px]">
                <Suspense fallback={
                    <div className="flex flex-col items-center gap-4 text-[#71C9CE]">
                        <Loader2 className="w-12 h-12 animate-spin" />
                        <p className="font-semibold tracking-wide animate-pulse text-slate-600">Loading verification...</p>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
