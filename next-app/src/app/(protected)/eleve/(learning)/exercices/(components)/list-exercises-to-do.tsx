"use client";

import {
  container,
  item,
  titleVariants,
} from "@/animations/exercice-and-lesson-list";
import SubjectLayout from "@/components/subject-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetExercisesToDo } from "@/hooks/queries/exercice/use-get-exercises-to-do";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Pencil } from "lucide-react";
import Link from "next/link";
import ExerciceListSkeleton from "./exercice-list-skeleton";
import ExerciceTypeBadge from "./exercice-type-badge";

interface ListExercisesToDoProps {
  selectedSubject: string | undefined;
}

export default function ListExercisesToDo({
  selectedSubject,
}: ListExercisesToDoProps) {
  const { data, isLoading, isError } = useGetExercisesToDo({
    subject: selectedSubject,
  });

  if (isLoading) {
    return (
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h2
          className="text-2xl font-bold text-foreground/90"
          variants={titleVariants}
          initial="hidden"
          animate="show"
        >
          {`Exercices à faire ${
            selectedSubject ? `en ${selectedSubject}` : ""
          }`}
        </motion.h2>
        <ExerciceListSkeleton count={4} />
      </motion.div>
    );
  }

  if (isError) {
    throw new Error(
      "Une erreur est survenue lors de la récupération des exercices"
    );
  }

  if (!data?.length) {
    return (
      <motion.div
        key={selectedSubject || "no-exercises"}
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
            Aucun exercice à faire
          </h3>
          <p className="text-muted-foreground">
            {selectedSubject
              ? `Vous n'avez pas encore d'exercice à faire en ${selectedSubject}`
              : "Commencez par faire des exercices pour les voir apparaître ici"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h2
        className="text-2xl font-bold text-foreground/90"
        variants={titleVariants}
        initial="hidden"
        animate="show"
      >
        {`Exercices à faire ${selectedSubject ? `en ${selectedSubject}` : ""}`}
      </motion.h2>

      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {data?.map((exercice) => (
            <motion.div
              key={exercice.id}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-lg line-clamp-2">
                    {exercice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center gap-3 pb-3">
                  {exercice.description && (
                    <p className="text-sm text-muted-foreground text-center line-clamp-2">
                      {exercice.description}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <ExerciceTypeBadge type={exercice.type.name} />
                    <SubjectLayout
                      label={exercice.lesson.LessonSubject.label}
                      color={exercice.lesson.LessonSubject.color}
                      className="text-xs"
                    />
                    <SubjectLayout
                      label={exercice.level.label}
                      color={exercice.level.color}
                      className="text-xs"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-lg group/btn gap-2 px-6 py-5 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <Link href={`/eleve/exercices/${exercice.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span>Commencer l'exercice</span>
                      <ArrowRight className="h-4 w-4 -mr-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
