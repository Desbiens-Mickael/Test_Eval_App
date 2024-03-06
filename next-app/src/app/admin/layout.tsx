import SideBar from "@/components/admin/side-bar";
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
      <SideBar />
      {children}
    </div>
  );
}
