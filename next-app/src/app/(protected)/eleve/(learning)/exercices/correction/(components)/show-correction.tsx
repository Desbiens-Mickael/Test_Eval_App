"use client";

import { badgeItem, container, item } from "@/animations/show-exercise";
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
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ExerciceResultCard from "./exercice-result-card";
import ExerciceResultMultipleChoice from "./exercice-result-multiple-choice";
import ExerciceResultTrueOrFalse from "./exercice-result-true-or-false";
import ExerciseResultGapFillText from "./exercise-result-gap-fill-text";

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
    <>
      <PageTitle title={data?.exercice?.title || "Correction"} />
      <motion.div
        className="space-y-4 mb-6 px-4 sm:px-6 py-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div
          className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words"
          variants={item}
        >
          {data?.exercice?.description}
        </motion.div>

        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3"
          variants={item}
        >
          <motion.div variants={badgeItem}>
            <NoteDisplay
              note={data?.note}
              coeficient={data?.coeficient}
              className="text-2xl font-bold"
            />
          </motion.div>
        </motion.div>
      </motion.div>

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
    </>
  );
}
