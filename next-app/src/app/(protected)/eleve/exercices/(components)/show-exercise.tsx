"use client";

import Loader from "@/components/loader";
import PageTitle from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import useGetExerciceById from "@/hooks/queries/exercice/use-get-exercice-by-id";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ExerciseGapFillText from "./exerciseTypes/gap-fill-text/exercise-gap-fill-text";

interface ShowExerciseProps {
  exerciceId: string;
}

export default function ShowExercise({ exerciceId }: ShowExerciseProps) {
  const router = useRouter();
  const { data, isLoading, error } = useGetExerciceById(exerciceId);

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace("/eleve/exercices");
    }
  }, [isLoading, data, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return null;
  }

  if (error) {
    throw new Error(
      "Une erreur est survenue lors de la récupération de l'exercice"
    );
  }

  return (
    <>
      <PageTitle title={data?.title || "Exercice"} />
      <div className="flex flex-col gap-2 mb-4">
        {data?.description}

        <div className="text-sm text-muted-foreground">
          Niveau:{" "}
          <Badge className={`${data?.levelColor} hover:${data?.levelColor}`}>
            {data?.level}
          </Badge>
        </div>
      </div>

      {data?.type === "Carte" && <div>Carte</div>}
      {data?.type === "Vrai ou Faux" && <div>Vrai ou Faux</div>}
      {data?.type === "Texte à trou" && (
        <ExerciseGapFillText
          exerciceId={data?.id}
          level={data?.level}
          content={data?.content as contentGapFillInput}
        />
      )}
      {data?.type === "Choix multiple" && <div>Choix multiple</div>}
    </>
  );
}
