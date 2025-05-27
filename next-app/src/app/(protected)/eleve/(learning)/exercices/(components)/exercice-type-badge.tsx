"use client";

import { Badge } from "@/components/ui/badge";

interface ExerciceTypeBadgeProps {
  type: string;
}

export default function ExerciceTypeBadge({ type }: ExerciceTypeBadgeProps) {
  return (
    <Badge className="text-slate-500 border-slate-500 bg-background rounded-md">
      {type}
    </Badge>
  );
}
