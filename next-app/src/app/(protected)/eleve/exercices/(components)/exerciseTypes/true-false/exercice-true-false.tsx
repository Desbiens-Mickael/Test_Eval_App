"use client";

import { RefreshCcw } from "lucide-react";
import { useCallback } from "react";

// Composants
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { ExerciceResultTrueOrFalse } from "./exercice-result-true-or-false";

// Hooks
import useTrueFalseExercice from "./hook/use-true-false-Exercice";

// Types
import { contentTrueOrFalseInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";

// Utilitaires
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
    note,
    isFullFilled,
    isPending,
    isSuccess,
    updateResponse,
    submitResponses,
    resetResponses,
  } = useTrueFalseExercice(content, level);

  const handleSubmit = useCallback(() => {
    submitResponses(exerciceId);
  }, [submitResponses, exerciceId]);

  if (isSuccess) {
    return (
      <ExerciceResultTrueOrFalse
        content={content}
        response={response}
        note={note}
      />
    );
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
        <Button
          title="Reinitialiser"
          size="icon"
          onClick={resetResponses}
          className="bg-background text-primary hover:bg-primary hover:text-background"
          disabled={isPending}
        >
          <RefreshCcw className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
