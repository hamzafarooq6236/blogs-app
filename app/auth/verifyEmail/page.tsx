"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function verify() {
            const token = searchParams.get("token");

            const res = await fetch("/api/auth/verifyEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (res.ok) {
                setIsLoading(false);

                setTimeout(() => {
                    router.push("/auth/signin");
                }, 2000);
            }
        }

        verify();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex justify-center items-center text-green-600">
            {isLoading ? (
                <>
                    <p>Verifying your account...</p>
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                </>
            ) : (
                <p>Your account has been verified.</p>
            )}
        </div>
    );
}