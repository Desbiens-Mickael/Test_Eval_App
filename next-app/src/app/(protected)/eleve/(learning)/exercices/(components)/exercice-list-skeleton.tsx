import { container, item } from "@/animations/exercice-and-lesson-list";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ExerciceListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={item}>
          <Card className="max-w-[300px] w-full flex flex-col">
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
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExerciceListSkeleton;
