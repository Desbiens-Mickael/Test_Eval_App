import Header from "@/components/header";
import Sidebar from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Dashbord",
};

const inter = Inter({ subsets: ["latin"] });

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(inter.className, "flex h-screen w-full")}>
      <Sidebar />
      <div className="flex flex-col items-center w-full ml-[300px]">
        <Header />
        <main className="relative flex flex-col items-center p-8 w-full h-full mt-20">{children}</main>
      </div>
    </div>
  );
}
