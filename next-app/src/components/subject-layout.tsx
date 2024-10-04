"use client";

import { Badge } from "@/components/ui/badge";

interface SubjectLayoutProps {
  label: string;
  color?: string;
}

export default function SubjectLayout({ label, color }: SubjectLayoutProps) {
  return (
    <Badge variant="outline" className={`${color} rounded-md text-white shadow-lg`}>
      {label}
    </Badge>
  );
}
