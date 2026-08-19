"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { forgotPasswordAction } from "@/actions/auth";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.currentTarget.value);
    }

    async function forgot(e: React.FormEvent) {
        e.preventDefault();

        const resData = await forgotPasswordAction(email);

        if (resData.success) {
            setMessage(resData.message || "OTP sent");
            setTimeout(()=>{
                if (resData.cid) {
                    router.push(`/auth/forgotpassword/otp?cid=${resData.cid}`);
                }
            },1000)
            
        } else {
            setMessage(resData.error || "Something went wrong");
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center text-black">
            <form
                onSubmit={forgot}
                className="bg-amber-200 text-black flex flex-col w-70 border-3 p-3 rounded-2xl gap-1"
            >
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    className="border-solid border-2 p-1 rounded bg-white"
                    onChange={handleChange}
                    value={email}
                    required
                />

                {message && (
                    <p className="text-sm text-green-700 my-1">{message}</p>
                )}

                <button
                    type="submit"
                    className="border-solid rounded-3xl w-24 cursor-pointer self-center border-2 py-1 mt-2 bg-amber-400 hover:bg-amber-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}