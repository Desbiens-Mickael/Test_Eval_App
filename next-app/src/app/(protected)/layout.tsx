import { cookies } from "next/headers";

import Header from "@/components/header/protected-header";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <Header />
        <div
          className={cn(
            inter.className,
            "flex flex-1 flex-col gap-4 p-4 pt-0 w-full max-w-screen-2xl mx-auto"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
