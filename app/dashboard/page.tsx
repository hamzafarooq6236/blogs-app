import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Welcome {session.user?.name}</h1>
            <div className="my-4">
                hello
            </div>

            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/auth/signin" });
                }}
            >
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Sign Out
                </button>
            </form>
        </div>
    );
}

