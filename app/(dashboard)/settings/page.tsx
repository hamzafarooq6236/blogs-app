import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Settings() {
    const session = await auth();
    if (!session) {
        redirect("/auth/signin")
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <form
                action={async () => {
                    "use server";
                    await signOut();
                }}
            >
                <Button variant="destructive" type="submit">Sign Out</Button>
            </form>
        </div>
    )
}