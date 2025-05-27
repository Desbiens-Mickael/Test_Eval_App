"use client";

import { badgeItem, container, item } from "@/animations/show-exercise";
import Loader from "@/components/loader";
import PageTitle from "@/components/page-title";
import SubjectLayout from "@/components/subject-layout";
import useGetExerciceById from "@/hooks/queries/exercice/use-get-exercice-by-id";
import {
  contentCardInput,
  contentGapFillInput,
  contentMultipleChoiceInput,
  contentTrueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ExerciceCard from "./exerciseTypes/card/exercice-card";
import ExerciseGapFillText from "./exerciseTypes/gap-fill-text/exercise-gap-fill-text";
import ExerciceMultipleChoice from "./exerciseTypes/multiple-choice/exercice-multiple-choice";
import ExerciceTrueFalse from "./exerciseTypes/true-false/exercice-true-false";

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
          {data?.description}
        </motion.div>

        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3"
          variants={item}
        >
          <motion.span className="font-medium" variants={badgeItem}>
            Niveau :
          </motion.span>
          <motion.div variants={badgeItem}>
            <SubjectLayout label={data?.level} color={data?.levelColor} />
          </motion.div>
        </motion.div>
      </motion.div>

      {data?.type === "Carte" && (
        <ExerciceCard
          exerciceId={data?.id}
          level={data?.level}
          content={data?.content as contentCardInput}
        />
      )}
      {data?.type === "Vrai ou Faux" && (
        <ExerciceTrueFalse
          exerciceId={data?.id}
          level={data?.level}
          content={data?.content as contentTrueOrFalseInput}
        />
      )}
      {data?.type === "Texte à trou" && (
        <ExerciseGapFillText
          exerciceId={data?.id}
          level={data?.level}
          content={data?.content as contentGapFillInput}
        />
      )}
      {data?.type === "Choix multiple" && (
        <ExerciceMultipleChoice
          exerciceId={data?.id}
          level={data?.level}
          content={data?.content as contentMultipleChoiceInput}
        />
      )}
    </>
  );
}
