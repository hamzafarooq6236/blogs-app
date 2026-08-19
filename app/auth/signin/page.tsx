"use client"
import { signIn } from "next-auth/react"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, LogIn, ArrowLeft } from "lucide-react";

interface FormInputs {
    email: string;
    password: string;
    form?: string;
}

export default function SignIn() {
    const { register, formState: { errors }, handleSubmit } = useForm<FormInputs>();
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function submit(data: FormInputs) {
        setAuthError(null);
        setIsLoading(true);
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                // NextAuth typically returns the Error message string directly in res.error if configured,
                // or you can just parse the error message if needed.
                const errorMessage = !res.code?.includes("verify")
                    ? "Invalid email or password"
                    : res.code;
                setAuthError(errorMessage);
                setIsLoading(false);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setAuthError("An unexpected error occurred");
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Subtle Background Elements */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60"></div>
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40"></div>

            <div className="max-w-md w-full z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#71C9CE] transition-colors mb-6 font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-white/60 border border-[#CBF1F5] rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-[#A6E3E9]/20 backdrop-blur-xl">
                    <div className="text-center mb-5">
                        <div className="w-14 h-14 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#71C9CE]">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back</h1>
                        <p className="text-slate-500 mt-2 text-sm">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
                        {authError && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center">
                                {authError}
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
                            <input
                                className="w-full bg-white border border-[#A6E3E9] focus:border-[#71C9CE] focus:ring-2 focus:ring-[#71C9CE]/20 text-slate-800 rounded-xl px-4 py-3 outline-none transition-all"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email?.message && (<p className="text-red-500 text-xs ml-1">{errors.email?.message}</p>)}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center ml-1 mr-1">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <Link href="/auth/forgotpassword" className="text-xs text-[#71C9CE] hover:text-[#5bb8bd] font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                className="w-full bg-white border border-[#A6E3E9] focus:border-[#71C9CE] focus:ring-2 focus:ring-[#71C9CE]/20 text-slate-800 rounded-xl px-4 py-3 outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                                {...register("password", {
                                    required: "Password required",
                                    minLength: { value: 8, message: "Minimum 8 characters" }
                                })}
                            />
                            {errors.password?.message && <p className="text-red-500 text-xs ml-1">{errors.password?.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#71C9CE] hover:bg-[#5bb8bd] disabled:bg-[#A6E3E9] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all font-semibold mt-2"
                        >
                            {isLoading ? "Signing in..." : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-px bg-[#A6E3E9]/50 flex-1"></div>
                        <span className="text-xs text-slate-400 font-medium uppercase">Or continue with</span>
                        <div className="h-px bg-[#A6E3E9]/50 flex-1"></div>
                    </div>

                    <button
                        className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-[#CBF1F5]/30 text-slate-700 border border-[#A6E3E9] rounded-xl transition-all font-medium"
                        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-[#71C9CE] hover:text-[#5bb8bd] font-semibold transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
