"use client";

import { Badge } from "@/components/ui/badge";
import { TemplateComponentProps } from "./table/filter-button/data-table-button-filter";

export default function SubjectLayout({ label, color }: TemplateComponentProps) {
  return (
    <Badge variant="outline" className={`${color} rounded-md text-white shadow-lg`}>
      {label}
    </Badge>
  );
}
