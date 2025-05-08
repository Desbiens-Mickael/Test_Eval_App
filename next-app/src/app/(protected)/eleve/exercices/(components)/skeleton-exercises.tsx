import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonExercises = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="max-w-[300px] w-full flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center gap-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-6 w-1/2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SkeletonExercises;
