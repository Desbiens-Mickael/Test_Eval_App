"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TemplateComponentProps } from "./table/filter-button/data-table-button-filter";

export default function SubjectLayout({
  label,
  color,
  className,
}: TemplateComponentProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md text-white shadow-lg", color, className)}
    >
      {label}
    </Badge>
  );
}
