"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AddToGroupSkeletonProps {
  className?: string;
}

export default function AddToGroupSkeleton({
  className,
}: AddToGroupSkeletonProps) {
  return <Skeleton className={cn("h-10 w-36", className)} />;
}
