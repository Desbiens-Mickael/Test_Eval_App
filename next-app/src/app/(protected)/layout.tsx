import Header from "@/components/header";
import Sidebar from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // h-screen
    <div className={cn(inter.className, "flex w-full relative flex-1")}>
      <Sidebar />
      <div className="flex flex-col items-center w-full ml-[300px] relative">
        <Header />
        <main className="flex flex-col items-center p-8 pb-16 w-full h-full">{children}</main>
      </div>
    </div>
  );
}
