"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { resetPasswordAction } from "@/actions/auth";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleReset(e: React.FormEvent) {
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
            const resData = await resetPasswordAction(password, token || "");

            if (resData.success) {
                setIsSuccess(true);
                setMessage(resData.message || "Password reset successfully!");
                setTimeout(() => {
                    router.push("/auth/signin");
                }, 2000);
            } else {
                setMessage(resData.error || "Failed to reset password.");
            }
        } catch (error) {
            setMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center text-black">
            <form
                onSubmit={handleReset}
                className="bg-amber-200 text-black flex flex-col w-80 border-3 p-4 rounded-2xl gap-3"
            >
                <h2 className="text-xl font-bold text-center">Reset Password</h2>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="font-semibold text-sm">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 border-gray-400 p-2 rounded bg-white"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="confirmPassword" className="font-semibold text-sm">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-2 border-gray-400 p-2 rounded bg-white"
                        required
                    />
                </div>

                {message && (
                    <div
                        className={`px-3 py-2 rounded text-sm text-center ${
                            isSuccess
                                ? "bg-green-100 border border-green-400 text-green-700"
                                : "bg-red-100 border border-red-400 text-red-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="border-2 border-black rounded-3xl px-4 cursor-pointer self-center py-1 mt-1 bg-amber-400 hover:bg-amber-500 font-semibold disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
