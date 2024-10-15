"use client";

import { Skeleton } from "../ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-[210px] h-[32px]" />
          <Skeleton className="w-[80px] h-[32px]" />
          <Skeleton className="w-[80px] h-[32px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="w-[80px] h-[32px] hidden lg:flex" />
          <Skeleton className="w-[32px] h-[32px]" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-1">
        <Skeleton className="w-full h-[60px]" />
        <Skeleton className="w-full h-[60px]" />
        <Skeleton className="w-full h-[60px]" />
        <Skeleton className="w-full h-[60px]" />
        <Skeleton className="w-full h-[60px]" />
      </div>

      <div className="w-full flex justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-[180px] h-[32px]" />
        </div>
        <div className="flex items-center space-x-10">
          <Skeleton className="w-[210px] h-[32px]" />
          <Skeleton className="w-[80px] h-[32px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="w-[32px] h-[32px]" />
            <Skeleton className="w-[32px] h-[32px]" />
            <Skeleton className="w-[32px] h-[32px]" />
            <Skeleton className="w-[32px] h-[32px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
