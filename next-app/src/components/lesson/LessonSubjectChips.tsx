import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
interface LessonSubject {
  id: string;
  label: string;
  color: string;
}

interface LessonSubjectChipsProps {
  selectedSubject: string | undefined;
  onClick: (subject: string | undefined) => void;
}

export const LessonSubjectChips = ({
  selectedSubject,
  onClick,
}: LessonSubjectChipsProps) => {
  const { data, isLoading, error } = useGetAllLessonsSubject();

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center flex-wrap">
        <Skeleton className="w-36 h-10" />
        <Skeleton className="w-20 h-10" />
        <Skeleton className="w-28 h-10" />
        <Skeleton className="w-24 h-10" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {data?.map((lessonSubject: LessonSubject) => (
        <Button
          key={lessonSubject.id}
          className={cn(
            "shadow-sm hover:shadow-md",
            "transition-all",
            "text-background",
            lessonSubject.color,
            {
              "scale-110 shadow-lg": selectedSubject === lessonSubject.label,
            }
          )}
          onClick={() => onClick(lessonSubject.label)}
        >
          <span className="text-sm font-medium">{lessonSubject.label}</span>
        </Button>
      ))}
      {selectedSubject && (
        <Button
          title="Reinitialiser"
          size="icon"
          onClick={() => onClick(undefined)}
          className="bg-background text-primary hover:bg-primary hover:text-background"
        >
          <RefreshCcw className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
