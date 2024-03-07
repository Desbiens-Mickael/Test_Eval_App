import Sidebar from "@/components/admin/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Dashbord",
};

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(inter.className, "flex h-screen w-full")}>
      <Sidebar />
      <div className="flex flex-col items-center w-full ml-[300px]">
        <header className="w-full h-20 shadow-md">
          <p>Header</p>
        </header>
        <main className="flex flex-col items-center p-8 w-full h-screen">{children}</main>
      </div>
    </div>
  );
}
