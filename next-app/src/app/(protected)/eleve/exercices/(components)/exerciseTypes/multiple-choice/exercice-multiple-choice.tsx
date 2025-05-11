"use client";

import SubmitButton from "@/components/form/submit-button";
import { useEffect } from "react";
import ExerciceResultMultipleChoice from "./exercice-result-multiple-choice";
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
    note,
    isPending,
    isSuccess,
    updateAnswerSelection,
    handleExerciseSubmission,
  } = useMultipleChoiceExercise({
    exerciceId,
    content,
    level,
  });

  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  return (
    <>
      {!isSuccess ? (
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
      ) : (
        <ExerciceResultMultipleChoice
          content={content}
          response={selectedAnswers}
          note={note}
        />
      )}
    </>
  );
}
