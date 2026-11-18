"use client";

import ListExercisesDone from "@/app/(protected)/eleve/(learning)/exercices/(components)/list-exercises-done";

/** Copies d'un enfant, toutes matières, vues par son parent */
export default function ChildCopies({ studentId }: { studentId: string }) {
  return <ListExercisesDone selectedSubject={undefined} studentId={studentId} forParent />;
}
