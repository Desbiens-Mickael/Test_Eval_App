"use client";

import SkeletonExercises from "@/app/(protected)/eleve/exercices/(components)/skeleton-exercises";
import { NoteDisplay } from "@/components/note-display";
import SubjectLayout from "@/components/subject-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetExercisesDone } from "@/hooks/queries/exercice/use-get-exercises-done";
import { formatDate } from "@/lib/utils";

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
        <h2 className="text-2xl font-bold">Exercices terminés</h2>
        <SkeletonExercises />
      </div>
    );
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div className="min-h-[300px] flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Exercice terminé</h2>
      <div className="flex flex-wrap gap-2">
        {data?.length === 0 ? (
          <Card className="max-w-[300px]">
            <CardHeader>
              <CardTitle className="text-center">Aucun exercice</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          data?.map((exercice) => (
            <Card
              className="max-w-[300px] flex flex-col"
              key={exercice.exerciceId}
            >
              <CardHeader>
                <CardTitle className="text-center">{exercice.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center gap-2">
                <SubjectLayout
                  label={exercice.lessonSubject}
                  color={exercice.lessonSubjectColor}
                />
                <NoteDisplay
                  note={exercice.note}
                  coeficient={10}
                  className="text-md"
                />
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <p className="text-center">
                  <span className="text-xs">Réalisé le: </span>
                  {formatDate(exercice.createdAt)}
                </p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
