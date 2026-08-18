import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings as SettingsIcon, LogOut, Key } from "lucide-react";

export default async function Settings() {
    const session = await auth();
    if (!session) {
        redirect("/auth/signin")
    }
    return (
        <div className="flex flex-col items-center justify-center p-6 mt-10 font-sans">
            <div className="w-full max-w-md p-8 bg-white/70 border border-[#CBF1F5] rounded-3xl backdrop-blur-md shadow-xl shadow-[#A6E3E9]/20 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mb-6 text-[#71C9CE]">
                    <SettingsIcon className="w-8 h-8" />
                </div>
                
                <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Settings</h1>
                
                <div className="flex flex-col gap-4 w-full">
                    <Link href="/settings/change-password" className="w-full">
                        <Button variant="outline" className="w-full py-6 flex items-center justify-center gap-2 border-2 border-[#A6E3E9] text-slate-700 hover:bg-[#CBF1F5]/30 hover:text-slate-900 rounded-xl transition-all font-semibold text-base shadow-sm">
                            <Key className="w-5 h-5" />
                            Change Password
                        </Button>
                    </Link>

                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                        className="w-full"
                    >
                        <Button type="submit" className="w-full py-6 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600 rounded-xl transition-all font-semibold text-base shadow-sm">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}