"use client";

import {
  container,
  item,
  titleVariants,
} from "@/animations/exercice-and-lesson-list";
import { NoteDisplay } from "@/components/note-display";
import SubjectLayout from "@/components/subject-layout";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetExercisesDone } from "@/hooks/queries/exercice/use-get-exercises-done";
import { formatControlDate } from "@/lib/control-period";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  FileX,
} from "lucide-react";
import Link from "next/link";
import ExerciceListSkeleton from "./exercice-list-skeleton";

interface ListExercisesDoneProps {
  selectedSubject: string | undefined;
  studentId?: string;
}

export default function ListExercisesDone({
  selectedSubject,
  studentId,
}: ListExercisesDoneProps) {
  const { data, isLoading, isError } = useGetExercisesDone({
    subject: selectedSubject,
    studentId,
  });

  const baseUrlShowCorrection = !studentId
    ? "/eleve/exercices/correction/"
    : `/admin/eleves/${studentId}/exercices/correction/`;

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
          {selectedSubject
            ? `Contrôles terminés en ${selectedSubject}`
            : "Tous les contrôles terminés"}
        </motion.h2>
        <ExerciceListSkeleton count={4} />
      </motion.div>
    );
  }

  if (isError) {
    throw new Error(
      "Une erreur est survenue lors de la récupération des contrôles"
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
            Aucun contrôle terminé
          </h3>
          <p className="text-muted-foreground">
            {selectedSubject
              ? `Vous n'avez pas encore terminé de contrôle en ${selectedSubject}`
              : "Commencez par faire des contrôles pour les voir apparaître ici"}
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
        {selectedSubject
          ? `Contrôles terminés en ${selectedSubject}`
          : "Tous les contrôles terminés"}
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
              key={exercice.studentExerciceId}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-lg line-clamp-2">
                    {exercice.title || "Aucun titre"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center gap-3 pb-3">
                  {exercice.lessonSubject && (
                    <SubjectLayout
                      label={exercice.lessonSubject}
                      color={exercice.lessonSubjectColor}
                      className="mb-2"
                    />
                  )}
                  <div className="w-full flex items-center justify-between px-4">
                    {exercice.note !== null ? (
                      <NoteDisplay
                        note={exercice.note}
                        coeficient={exercice.coeficient}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        Copie rendue
                      </span>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {formatDate(exercice.createdAt)}
                    </div>
                  </div>
                  {exercice.isMissing && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                      <FileX className="h-3.5 w-3.5" aria-hidden="true" />
                      Non rendu avant la clôture
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  {exercice.resultsAvailableAt ? (
                    <p className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground text-center">
                      <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Note et correction le{" "}
                      {formatControlDate(exercice.resultsAvailableAt)}
                    </p>
                  ) : exercice.exerciceId ? (
                    <Button
                      asChild
                      size="lg"
                      className="w-full rounded-lg group/btn gap-2 px-6 py-5 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <Link
                        href={`${baseUrlShowCorrection}${exercice.studentExerciceId}`}
                      >
                        <Check className="h-4 w-4" />
                        <span>Voir la correction</span>
                        <ArrowRight className="h-4 w-4 -mr-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  ) : (
                    <Alert
                      variant="destructive"
                      className="p-2 bg-destructive/5"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-sm p-0">
                          Exercice supprimé
                        </AlertTitle>
                      </div>
                    </Alert>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
