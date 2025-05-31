"use client";

import { container, item } from "@/animations/exercice-and-lesson-list";
import SubjectLayout from "@/components/subject-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useGetAllLessonsForStudent from "@/hooks/queries/lesson/use-get-all-lessons-for-student";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LessonListSkeleton from "./Lesson-List-skeleton";

interface LessonListProps {
  selectedSubject: string | undefined;
}

const LessonList = ({ selectedSubject }: LessonListProps) => {
  const { data, isLoading, isError } = useGetAllLessonsForStudent({
    subject: selectedSubject,
  });

  if (isLoading) return <LessonListSkeleton />;

  if (isError)
    throw new Error(
      "Une erreur est survenue lors de la récupération des leçons"
    );

  if (!data?.length) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-semibold text-foreground">
            Aucune leçon trouvée
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedSubject
              ? `Aucune leçon disponible pour la matière sélectionnée.`
              : "Commencez par ajouter votre première leçon."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
        key={selectedSubject || "all-lessons"}
      >
        {data.map((lesson, index) => (
          <motion.div key={lesson.id} variants={item} layout className="h-full">
            <Card className="group relative h-full flex flex-col overflow-hidden border border-border/10 dark:border-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 dark:hover:border-primary/30">
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <Image
                  src={
                    lesson.imageBanner || "/assets/images/img-placeholder.png"
                  }
                  alt={lesson.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <SubjectLayout
                  className="absolute top-3 left-3 border-none"
                  label={lesson.subject}
                  color={lesson.subjectColor}
                />
                <SubjectLayout
                  className="absolute top-3 right-3 border-none"
                  label={lesson.gradeLevel || "Tous niveaux"}
                  color={lesson.gradeLevelColor}
                />
              </div>

              <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {lesson.title}
                </h3>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-lg group/btn gap-2 px-6 py-5 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <Link href={`/eleve/lecons/${lesson.id}`}>
                      <BookOpen className="h-4 w-4" />
                      <span>Commencer la leçon</span>
                      <ArrowRight className="h-4 w-4 -mr-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default LessonList;
