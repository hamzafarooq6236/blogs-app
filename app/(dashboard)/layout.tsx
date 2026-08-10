import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function SidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <div className="">
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-12 items-center px-4">
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