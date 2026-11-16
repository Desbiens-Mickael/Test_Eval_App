"use client";

import PageTitle from "@/components/page-title";
import useGetExerciceById from "@/hooks/queries/exercice/use-get-exercice-by-id";
import ExerciceForm from "./form/exercice-form";

interface EditExerciceProps {
  exerciceId: string;
}

export default function EditExercice({ exerciceId }: EditExerciceProps) {
  const { data, isLoading, isError, error } = useGetExerciceById(exerciceId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <PageTitle
        title={data?.kind === "PRACTICE" ? "Modifier un exercice" : "Modifier un contrôle"}
      />
      <ExerciceForm exerciceData={data} />
    </>
  );
}
