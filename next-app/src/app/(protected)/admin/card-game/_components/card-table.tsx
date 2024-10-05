"use client";

import Loader from "@/components/loader";
import ExercicesTable from "@/components/table/exercice-table/exercices-table";
import useGetAllExercicesCard from "@/hooks/queries/use-get-all-exercices-card";
import { toast } from "sonner";

export default function CardTable() {
  const { data, isLoading, isError } = useGetAllExercicesCard();

  if (isError) {
    toast.error("Une erreur est survenue lors de la récupération des exercices");
  }

  return <>{!isLoading && data ? <ExercicesTable exerciceData={data} /> : <Loader />}</>;
}
