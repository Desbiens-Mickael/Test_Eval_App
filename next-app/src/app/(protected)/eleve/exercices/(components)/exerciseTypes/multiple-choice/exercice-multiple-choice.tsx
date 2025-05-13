"use client";

import SubmitButton from "@/components/form/submit-button";
import { redirect } from "next/navigation";
import { useMultipleChoiceExercise } from "./hooks/useMultipleChoiceExercise";
import QuestionCard from "./question-card";
import { MultipleChoiceExerciseProps } from "./types";

export default function ExerciceMultipleChoice({
  exerciceId,
  content,
  level,
}: MultipleChoiceExerciseProps) {
  const {
    selectedAnswers,
    isPending,
    isSuccess,
    data,
    updateAnswerSelection,
    handleExerciseSubmission,
  } = useMultipleChoiceExercise({
    exerciceId,
    content,
    level,
  });

  if (isSuccess && data?.data) {
    redirect(`/eleve/exercices/correction/${data?.data.id}`);
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto p-4 space-y-8">
        {content.map((question, index) => (
          <QuestionCard
            key={`question-${index}`}
            question={question}
            questionIndex={index}
            selectedAnswers={selectedAnswers}
            onAnswerToggle={updateAnswerSelection}
          />
        ))}
        <div className="p-4">
          <SubmitButton
            onClick={handleExerciseSubmission}
            texte="Soumettre"
            isLoading={isPending}
          />
        </div>
      </div>
    </>
  );
}
