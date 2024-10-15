"use client";

import { cn } from "@/lib/utils";
import { TemplateComponentProps } from "./table/filter-button/data-table-button-filter";

export default function LevelLayout({ label, color }: TemplateComponentProps) {
  return (
    <div className="flex items-center">
      {color && <div className={cn("w-3 h-3 rounded-full mr-2", color)}></div>} {label}
    </div>
  );
}
