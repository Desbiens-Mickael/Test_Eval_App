"use client";

import SkeletonExercises from "@/app/(protected)/eleve/exercices/(components)/skeleton-exercises";
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
import { formatDate } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ListExercisesDoneProps {
  selectedSubject: string | undefined;
}

export default function ListExercisesDone({
  selectedSubject,
}: ListExercisesDoneProps) {
  const { data, isLoading, error } = useGetExercisesDone({
    subject: selectedSubject,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">
          {selectedSubject
            ? `Exercices terminés en ${selectedSubject}`
            : "Tous les exercices terminés"}
        </h2>
        <SkeletonExercises />
      </div>
    );
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div className="min-h-[300px] flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        {selectedSubject
          ? `Exercices terminés en ${selectedSubject}`
          : "Tous les exercices terminés"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.length === 0 ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">Aucun exercice</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          data?.map((exercice) => (
            <Card
              className="w-full flex flex-col"
              key={exercice.studentExerciceId}
            >
              <CardHeader>
                <CardTitle className="text-center text-lg">
                  {exercice.title || "Aucun titre"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center gap-2">
                {exercice.lessonSubject && (
                  <SubjectLayout
                    label={exercice.lessonSubject}
                    color={exercice.lessonSubjectColor}
                  />
                )}
                <NoteDisplay
                  note={exercice.note}
                  coeficient={10}
                  className="text-md"
                />
                <p className="text-center">
                  <span className="text-xs">Réalisé le: </span>
                  {formatDate(exercice.createdAt)}
                </p>
              </CardContent>
              <CardFooter className="p-2">
                {exercice.exerciceId ? (
                  <Button className="w-full" asChild>
                    <Link
                      href={`/eleve/exercices/correction/${exercice.studentExerciceId}`}
                    >
                      Voir la correction
                    </Link>
                  </Button>
                ) : (
                  <Alert variant="destructive" className="p-2">
                    <div className="flex  justify-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-xs p-0">
                        Exercice supprimé
                      </AlertTitle>
                    </div>
                  </Alert>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
