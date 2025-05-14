import { cookies } from "next/headers";

import Header from "@/components/header";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
      {/* <div className={cn(inter.className, "flex w-full relative flex-1")}> */}
      <AppSidebar />
      <SidebarInset className="overflow-hidden relative">
        <Header />
        {/* <div className="flex flex-col w-full relative"> */}
        <main className="w-full h-full flex flex-col p-8 pb-16 max-w-screen-xl mx-auto">
          {children}
        </main>
        {/* </div> */}
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
