"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface LinkSidebarProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  className?: string;
}

export default function LinkSidebar({ href, icon, title, className }: LinkSidebarProps) {
  const styleMain = "text-primary font-bold rounded-md hover:bg-slate-200 transition-all p-2";
  return (
    <Link href={href} className={cn(styleMain, className)}>
      <span className="flex gap-3">
        {icon} {title}
      </span>
    </Link>
  );
}
