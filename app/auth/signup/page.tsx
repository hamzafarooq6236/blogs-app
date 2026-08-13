"use client"
import { signUpAction } from "@/actions/auth";
import { signIn } from "next-auth/react"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormInputs {
    name: string;
    email: string;
    password: string;
    form?: string;
}

export default function SignIn() {
    const { register, formState: { errors }, handleSubmit } = useForm<FormInputs>();
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function submit(data: FormInputs) {
        setMessage(null);
        setErrorMsg(null);
        const res = await signUpAction(data);
        if (res.success) {
            setMessage(res.message || "Signup successful!");
        } else {
            setErrorMsg(res.error || "Signup failed");
        }
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-2">
            <form onSubmit={handleSubmit(submit)} className="rounded-2xl text-black border-2 p-3 flex flex-col justify-center gap-2 items-center">
                <div className="flex flex-col">
                <label className="text-black">Name</label>
                <input className="border-2" type="text" {...register("name", {
                    required: "Name is required",
                    minLength: {
                        value: 2,
                        message: "Minimum 8 characters"
                    }
                })} />
                {errors.name?.message && (<p className="text-red-500">{errors.name?.message}</p>)}
                </div>
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
                {message && <p className="text-green-600 text-sm">{message}</p>}
                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                <button type="submit" className=" rounded-2xl border-2 p-2 text-black w-30 cursor-pointer">Submit</button>
            </form>
            <Link href="/auth/signin" className="text-blue-500">Already have an account</Link>
            <button className="text-yellow-500 rounded-2xl p-2 border-2 cursor-pointer" onClick={() => signIn("google", { redirectTo: "/dashboard" })}>
                Sign up with Google
            </button>
        </div>
    )
}
