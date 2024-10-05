"use client";

import Loader from "@/components/loader";
import ExercicesTable from "@/components/table/exercice-table/exercices-table";
import useGetAllExercicesList from "@/hooks/queries/use-get-all-exercices-list";
import { toast } from "sonner";

export default function ListTable() {
  const { data, isLoading, isError } = useGetAllExercicesList();

  if (isError) {
    toast.error("Une erreur est survenue lors de la récupération des exercices");
  }

  return <>{!isLoading && data ? <ExercicesTable exerciceData={data} /> : <Loader />}</>;
}
