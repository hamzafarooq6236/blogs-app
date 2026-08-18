import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Settings() {
    const session = await auth();
    if (!session) {
        redirect("/auth/signin")
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Link href="/settings/change-password" className="w-full">
                    <Button variant="outline" className="w-full">Change Password</Button>
                </Link>

                <form
                    action={async () => {
                        "use server";
                        await signOut();
                    }}
                    className="w-full"
                >
                    <Button variant="destructive" type="submit" className="w-full">Sign Out</Button>
                </form>
            </div>
        </div>
    )
}