import { container, item } from "@/animations/exercice-and-lesson-list";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const LessonListSkeleton = ({ count = 4 }: { count?: number }) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    variants={container}
    initial="hidden"
    animate="show"
  >
    {[...Array(count)].map((_, i) => (
      <motion.div key={i} variants={item}>
        <Card className="group relative h-full flex flex-col overflow-hidden border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
            <Skeleton className="h-full w-full rounded-none" />
            <Skeleton className="absolute top-3 left-3 h-6 w-20 rounded-full" />
          </div>
          <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
);

export default LessonListSkeleton;
