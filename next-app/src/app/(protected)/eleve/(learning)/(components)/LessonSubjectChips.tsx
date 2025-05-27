import ButtonReset from "@/components/button-reset";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface LessonSubject {
  id: string;
  label: string;
  color: string;
}

interface LessonSubjectChipsProps {
  selectedSubject: string | undefined;
  handleSelectSubject: (subject: string | undefined) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

export const LessonSubjectChips = ({
  selectedSubject,
  handleSelectSubject,
}: LessonSubjectChipsProps) => {
  const { data, isLoading, error } = useGetAllLessonsSubject();

  if (isLoading) {
    return (
      <motion.div
        className="flex gap-3 items-center flex-wrap"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} variants={item}>
            <Skeleton className="w-24 h-10 rounded-full" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
        Erreur lors du chargement des matières
      </div>
    );
  }

  const handleSubjectClick = (label: string) => {
    handleSelectSubject(selectedSubject === label ? undefined : label);
  };

  return (
    <motion.div
      className="flex gap-3 items-center flex-wrap"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {data?.map((lessonSubject: LessonSubject) => (
          <motion.div
            key={lessonSubject.id}
            variants={item}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Button
              className={cn(
                "rounded-full px-5 h-10 text-sm font-medium transition-all duration-300",
                "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
                "border-2 border-transparent hover:border-white/20",
                lessonSubject.color,
                {
                  "ring-2 ring-offset-2 ring-offset-background ring-primary/50 scale-105 shadow-md":
                    selectedSubject === lessonSubject.label,
                  "opacity-90 hover:opacity-100":
                    !selectedSubject || selectedSubject === lessonSubject.label,
                  "opacity-60 hover:opacity-80":
                    selectedSubject && selectedSubject !== lessonSubject.label,
                }
              )}
              onClick={() => handleSubjectClick(lessonSubject.label)}
            >
              {lessonSubject.label}
            </Button>
          </motion.div>
        ))}

        {selectedSubject && (
          <motion.div
            key="reset-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <ButtonReset
              onClick={() => handleSelectSubject(undefined)}
              text="Réinitialiser"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
