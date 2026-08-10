"use client"
import { signIn } from "next-auth/react"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormInputs {
    email: string;
    password: string;
    form?: string;
}

export default function SignIn() {
    const { register, formState: { errors }, handleSubmit } = useForm<FormInputs>();
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);

    async function submit(data: FormInputs) {
        setAuthError(null);
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                setAuthError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setAuthError("Invalid email or password");
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-2">
            <form onSubmit={handleSubmit(submit)} className="rounded-2xl text-black border-2 p-3 flex flex-col justify-center gap-2 items-center">
                {authError && <p className="text-red-500 font-medium">{authError}</p>}
                <div className="flex flex-col">
                <label className="text-black">Email</label>
                <input className="border-2" type="email" {...register("email", {
                    required: "Email is required"
                })} />
                {errors.email?.message && (<p className="text-red-500">{errors.email?.message}</p>)}
                </div>
                <div className="flex flex-col">
                <label className="text-black">Password</label>
                <input className="border-2" type="password" {...register("password", {
                    required: "Password required",
                    minLength: {
                        value: 8,
                        message: "Minimum 8 characters"
                    }
                })} />
                {errors.password?.message && <p className="text-red-500">{errors.password?.message}</p>}
                </div>
                <button type="submit" className="rounded-2xl border-2 p-2 text-black w-30 cursor-pointer">Submit</button>
            </form>
            <Link href="/auth/signup" className="text-blue-500">Create an account?</Link>
            <button className="text-yellow-500 rounded-2xl p-2 border-2 cursor-pointer" onClick={() => signIn("google", { redirectTo: "/dashboard" })}>
                Sign In with Google
            </button>
        </div>
    )
}
