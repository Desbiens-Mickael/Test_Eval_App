"use client";

import { Badge } from "@/components/ui/badge";

interface ExerciceTypeBadgeProps {
  type: string;
}

export default function ExerciceTypeBadge({ type }: ExerciceTypeBadgeProps) {
  return (
    <Badge className="text-muted-foreground border-muted-foreground bg-background rounded-md">
      {type}
    </Badge>
  );
}
