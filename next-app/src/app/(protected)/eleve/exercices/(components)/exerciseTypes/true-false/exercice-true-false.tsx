"use client";

import { useCallback } from "react";

// Composants
import SubmitButton from "@/components/form/submit-button";

// Hooks
import useTrueFalseExercice from "./hook/use-true-false-Exercice";

// Types
import { contentTrueOrFalseInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";
import { redirect } from "next/navigation";

// Utilitaires
import ButtonReset from "@/components/button-reset";
import TrueFalseQuestion from "./true-false-question";

interface ExerciceTrueFalseProps extends baseResponseExercice {
  content: contentTrueOrFalseInput;
}

// Composant principal
export default function ExerciceTrueFalse({
  exerciceId,
  content,
  level,
}: ExerciceTrueFalseProps) {
  const {
    response,
    isFullFilled,
    isPending,
    isSuccess,
    data,
    updateResponse,
    submitResponses,
    resetResponses,
  } = useTrueFalseExercice(content, level);

  const handleSubmit = useCallback(() => {
    submitResponses(exerciceId);
  }, [submitResponses, exerciceId]);

  if (isSuccess && data?.data) {
    redirect(`/eleve/exercices/correction/${data?.data.id}`);
  }

  return (
    <div className="space-y-6">
      {content.map((question, index) => (
        <TrueFalseQuestion
          key={index}
          question={question.question}
          index={index}
          currentAnswer={response[index]?.answer}
          onAnswerChange={(answer) => updateResponse(index, answer)}
          isError={response[index]?.answer === null && !isFullFilled}
        />
      ))}
      <div className="flex justify-between items-center">
        <SubmitButton
          onClick={handleSubmit}
          className="w-fit"
          texte="Soumettre"
          isLoading={isPending}
        />
        <ButtonReset onClick={resetResponses} isPending={isPending} />
      </div>
    </div>
  );
}
