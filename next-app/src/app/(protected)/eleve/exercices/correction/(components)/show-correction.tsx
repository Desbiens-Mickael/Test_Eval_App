"use client";

import Loader from "@/components/loader";
import { NoteDisplay } from "@/components/note-display";
import PageTitle from "@/components/page-title";
import { useGetStudentExerciceById } from "@/hooks/queries/exercice/use-get-student-exercice-by-id";
import {
  cardResponseItemType,
  gapFillTextResponseType,
  multipleChoiceResponseType,
  trueOrFalseResponseType,
} from "@/shema-zod/exercice-corection.shema";
import {
  contentCardInput,
  contentGapFillInput,
  contentMultipleChoiceInput,
  contentTrueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ExerciceResultCard from "./exercice-result-card";
import ExerciseResultGapFillText from "./exercise-result-gap-fill-text";
import ExerciceResultMultipleChoice from "./exercice-result-multiple-choice";
import ExerciceResultTrueOrFalse from "./exercice-result-true-or-false";

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
      <div className="w-full flex justify-center items-center bg-white rounded-lg shadow-md p-6">
        <NoteDisplay
          note={data?.note}
          coeficient={data?.coeficient}
          className="text-2xl font-bold"
        />
      </div>
      {data?.exercice?.type.name === "Texte à trou" && (
        <ExerciseResultGapFillText
          content={data?.exercice?.content as contentGapFillInput}
          response={data?.response as gapFillTextResponseType}
        />
      )}
      {data?.exercice?.type.name === "Carte" && (
        <ExerciceResultCard
          content={data?.exercice?.content as contentCardInput}
          response={data?.response as cardResponseItemType[]}
        />
      )}
      {data?.exercice?.type.name === "Vrai ou Faux" && (
        <ExerciceResultTrueOrFalse
          content={data?.exercice?.content as contentTrueOrFalseInput}
          response={data?.response as trueOrFalseResponseType}
        />
      )}
      {data?.exercice?.type.name === "Choix multiple" && (
        <ExerciceResultMultipleChoice
          content={data?.exercice?.content as contentMultipleChoiceInput}
          response={data?.response as multipleChoiceResponseType}
        />
      )}
    </div>
  );
}
