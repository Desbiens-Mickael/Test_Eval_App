"use client";

import { cn } from "@/lib/utils";

type LevelLayoutProps = {
  label: string;
  color?: string;
};

export default function LevelLayout({ label, color }: LevelLayoutProps) {
  return (
    <div className="flex items-center">
      {color && <div className={cn("w-3 h-3 rounded-full mr-2", color)}></div>} {label}
    </div>
  );
}
