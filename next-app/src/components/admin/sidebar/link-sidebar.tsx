"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface LinkSidebarProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  className?: string;
  callback?: () => number | undefined;
}

export default function LinkSidebar({ href, icon, title, className, callback }: LinkSidebarProps) {
  const styleMain = "text-primary font-bold rounded-md hover:bg-slate-200 transition-all p-2";
  const infos = callback ? callback() : null;
  return (
    <Link href={href} className={cn(styleMain, className)}>
      <span className="flex gap-3">
        {icon} <span className="grow">{title}</span> {infos && infos}
      </span>
    </Link>
  );
}
