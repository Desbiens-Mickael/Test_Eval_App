"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";

// Hooks
import useTrueFalseExercice from "./hook/use-true-false-Exercice";

// Types
import { contentTrueOrFalseInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";
import { redirect } from "next/navigation";

// Utilitaires
import { container, item } from "@/animations/exercice-true-false";
import { ExerciseActions } from "../../exercise-actions";
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
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 max-w-2xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {content.map((question, index) => (
            <motion.div
              key={index}
              variants={item}
              layoutId={`question-${index}`}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <TrueFalseQuestion
                question={question.question}
                index={index}
                currentAnswer={response[index]?.answer}
                onAnswerChange={(answer) => updateResponse(index, answer)}
                isError={response[index]?.answer === null && !isFullFilled}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ExerciseActions
          textCount="Questions répondues"
          filledCount={response.filter((r) => r.answer !== null).length}
          totalCount={content.length}
          isPending={isPending}
          onSubmit={handleSubmit}
          onReset={resetResponses}
        />
      </motion.div>
    </div>
  );
}
