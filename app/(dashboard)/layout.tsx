import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function SidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const session = await auth();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <div className="">
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar user={session?.user} />
                <SidebarInset>
                    <header className="flex h-12 items-center px-4">
                        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#baf6fc] rounded-full blur-3xl opacity-60 pointer-events-none z-[0]"></div>
                        <SidebarTrigger />
                    </header>

                    <main className="">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}