"use client";

import { redirect } from "next/navigation";
import { ExerciseActions } from "../../exercise-actions";
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
    resetExercise,
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

        <ExerciseActions
          textCount="Questions répondues"
          filledCount={selectedAnswers.length}
          totalCount={content.length}
          onReset={resetExercise}
          onSubmit={handleExerciseSubmission}
          isPending={isPending}
          disabled={selectedAnswers.length === 0}
        />
      </div>
    </>
  );
}
