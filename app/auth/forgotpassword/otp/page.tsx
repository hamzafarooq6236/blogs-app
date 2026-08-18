"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { verifyOtpAction } from "@/actions/auth";

function OtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = "otp sent to registered email";
    const [otpInput, setOtpInput] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const cid = searchParams.get("cid") || "";

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();

        const data = await verifyOtpAction(otpInput, cid);

        if (data.success) {
            setStatusMessage("OTP Verified Successfully!");
            router.push(`/auth/resetpassword?token=${data.token}`);
        } else {
            setStatusMessage(data.error || "Invalid OTP. Please try again.");
        }
    }


    return (
        <div className="min-h-screen flex justify-center items-center text-black">
            <form
                onSubmit={handleVerify}
                className="bg-amber-200 text-black flex flex-col w-80 border-3 p-4 rounded-2xl gap-3"
            >
                <h2 className="text-xl font-bold text-center">Enter OTP</h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm text-center">
                        {message}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label htmlFor="otp" className="font-semibold text-sm">
                        OTP Code
                    </label>
                    <input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="border-2 border-gray-400 p-2 rounded bg-white text-center text-lg tracking-widest font-mono"
                        maxLength={6}
                        required
                    />
                </div>

                {statusMessage && (
                    <p
                        className={`text-sm text-center font-medium ${statusMessage.includes("Successfully")
                                ? "text-green-700"
                                : "text-red-600"
                            }`}
                    >
                        {statusMessage}
                    </p>
                )}

                <button
                    type="submit"
                    className="border-2 border-black rounded-3xl w-28 cursor-pointer self-center py-1 mt-1 bg-amber-400 hover:bg-amber-500 font-semibold"
                >
                    Verify OTP
                </button>
            </form>
        </div>
    );
}

export default function OtpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpContent />
        </Suspense>
    );
}