"use client";

import ExerciceTypeBadge from "@/app/(protected)/eleve/exercices/(components)/exercice-type-badge";
import SkeletonExercises from "@/app/(protected)/eleve/exercices/(components)/skeleton-exercises";
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
import Link from "next/link";

interface ListExercisesToDoProps {
  selectedSubject: string | undefined;
}

export default function ListExercisesToDo({
  selectedSubject,
}: ListExercisesToDoProps) {
  // Récupération des exercices du groupe qui n'ont pas été fait par l'élève
  const { data, isLoading, error } = useGetExercisesToDo({
    subject: selectedSubject,
  });

  if (isLoading) {
    return <SkeletonExercises />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-[300px] flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{`Exercices à faire ${
        selectedSubject ? `en ${selectedSubject}` : ""
      }`}</h2>
      {data?.length === 0 ? (
        <div className="flex flex-wrap gap-2">
          <Card className="max-w-[300px]">
            <CardHeader>
              <CardTitle className="text-center">Aucun exercice</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.map((exercice) => (
            <Card className="max-w-full flex flex-col" key={exercice.id}>
              <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">
                  {exercice.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {exercice.description}
                </p>
                <div className="flex items-center  flex-wrap gap-x-4 gap-y-2 mt-2">
                  <ExerciceTypeBadge type={exercice.type.name} />
                  <SubjectLayout
                    label={exercice.lesson.LessonSubject.label}
                    color={exercice.lesson.LessonSubject.color}
                  />
                  <SubjectLayout
                    label={exercice.level.label}
                    color={exercice.level.color}
                  />
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Button asChild className="w-full">
                  <Link href={`/eleve/exercices/${exercice.id}`}>
                    Faire l'exercice
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
