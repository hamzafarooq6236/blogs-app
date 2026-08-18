"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/actions/auth";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const resData = await changePasswordAction(password);

            if (resData.success) {
                setIsSuccess(true);
                setMessage(resData.message || "Password updated successfully!");
                setTimeout(() => {
                    router.push("/settings");
                }, 2000);
            } else {
                setMessage(resData.error || "Failed to update password.");
            }
        } catch (error) {
            setMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 mt-10 font-sans relative">
            <div className="w-full max-w-md p-8 bg-white/70 border border-[#CBF1F5] rounded-3xl backdrop-blur-md shadow-xl shadow-[#A6E3E9]/20">
                
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#CBF1F5] rounded-2xl flex items-center justify-center text-[#71C9CE]">
                        <KeyRound className="w-8 h-8" />
                    </div>
                </div>

                <form
                    onSubmit={handleChangePassword}
                    className="flex flex-col gap-5"
                >
                    <h2 className="text-2xl font-extrabold text-slate-800 text-center tracking-tight mb-2">Change Password</h2>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="font-semibold text-sm text-slate-700 ml-1">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-[#A6E3E9] focus:border-[#71C9CE] focus:ring-2 focus:ring-[#71C9CE]/20 text-slate-800 rounded-xl px-4 py-3 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="font-semibold text-sm text-slate-700 ml-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white border border-[#A6E3E9] focus:border-[#71C9CE] focus:ring-2 focus:ring-[#71C9CE]/20 text-slate-800 rounded-xl px-4 py-3 outline-none transition-all"
                            required
                        />
                    </div>

                    {message && (
                        <div
                            className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${
                                isSuccess
                                    ? "bg-green-50 border border-[#71C9CE] text-[#3b9ea4]"
                                    : "bg-red-50 border border-red-200 text-red-600"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#71C9CE] hover:bg-[#5bb8bd] disabled:bg-[#A6E3E9] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all font-semibold"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => router.push("/settings")}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-[#CBF1F5]/30 text-slate-700 border border-[#A6E3E9] rounded-xl transition-all font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
