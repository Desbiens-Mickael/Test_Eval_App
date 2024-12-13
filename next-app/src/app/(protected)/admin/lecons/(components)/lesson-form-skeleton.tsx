import { Skeleton } from "@/components/ui/skeleton";

export default function LessonFormSkeleton() {
  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col space-y-8">
      <div className="w-full flex flex-col lg:flex-row  items-center gap-8 lg:gap-16">
        <Skeleton className="w-full h-12 lg:w-72" />
        <Skeleton className="w-full h-12 lg:w-72" />
        <Skeleton className="w-full h-12 lg:w-72" />
      </div>
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="min-h-96 rounded-xl" />
      </div>
      <div>
        <Skeleton className="w-44 h-10 ml-auto" />
      </div>
    </div>
  );
}
