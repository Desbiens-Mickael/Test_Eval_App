"use client";

import Loader from "@/components/loader";
import ExercicesTable from "@/components/table/exercice-table/exercices-table";
import useGetAllExercicesFillBlank from "@/hooks/queries/use-get-all-exercices-fill-blank";
import { toast } from "sonner";

export default function FillBlankTable() {
  const { data, isLoading, isError } = useGetAllExercicesFillBlank();

  if (isError) {
    toast.error("Une erreur est survenue lors de la récupération des exercices");
  }

  return <>{!isLoading && data ? <ExercicesTable exerciceData={data} /> : <Loader />}</>;
}
