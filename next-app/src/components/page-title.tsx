"use client";

import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className }: PageTitleProps) {
  return (
    <h1 className={cn("text-6xl font-bold mb-28 text-center", className)}>
      {title}
    </h1>
  );
}
