"use client";

import Loader from "@/components/loader";
import PageTitle from "@/components/page-title";
import { useGetStudentExerciceById } from "@/hooks/queries/exercice/use-get-student-exercice-by-id";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ExerciseResultGapFillText } from "../../(components)/exerciseTypes/gap-fill-text/exercise-result-gap-fill-text";

interface ShowCorrectionProps {
  studentExerciceId: string;
}

export default function ShowCorrection({
  studentExerciceId,
}: ShowCorrectionProps) {
  const router = useRouter();
  const { data, isLoading, error } = useGetStudentExerciceById({
    studentExerciceId,
  });

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
    throw Error(
      "Une erreur est survenue lors de la recherche de la correction"
    );
  }

  return (
    <div>
      <PageTitle title={data?.exercice?.title || "Correction"} />
      <div className="flex flex-col gap-2 mb-4">
        {data?.exercice?.description}
      </div>
      {data?.exercice?.type.name === "Texte à trou" && (
        <ExerciseResultGapFillText
          content={data?.exercice?.content as contentGapFillInput}
          response={data?.response}
          note={data?.note}
          coeficient={data?.coeficient}
        />
      )}
      {data?.exercice?.type.name === "Carte" && <div>Carte</div>}
      {data?.exercice?.type.name === "Vrai ou Faux" && <div>Vrai ou Faux</div>}
      {data?.exercice?.type.name === "Choix multiple" && (
        <div>Choix multiple</div>
      )}
    </div>
  );
}
