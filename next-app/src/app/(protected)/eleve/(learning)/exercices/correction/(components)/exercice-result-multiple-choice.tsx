"use client";

import {
  answerItem,
  container,
  item,
} from "@/animations/exercice-result-multiple-choice";
import { multipleChoiceResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentMultipleChoiceInput } from "@/shema-zod/exercice.shema";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ExerciceResultMultipleChoiceProps {
  content: contentMultipleChoiceInput;
  response: multipleChoiceResponseType;
}

export default function ExerciceResultMultipleChoice({
  content,
  response,
}: ExerciceResultMultipleChoiceProps) {
  // Cherche si la réponse answerIndex a été sélectionnée pour la question questionIndex
  const isAnswerSelected = (questionIndex: number, answerIndex: number) => {
    const answerObj = response.find((r) => r.questionIndex === questionIndex);
    return answerObj ? answerObj.selectedAnswers.includes(answerIndex) : false;
  };

  return (
    <motion.div
      className="w-full bg-card border rounded-xl max-w-2xl mx-auto p-4 space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <AnimatePresence>
        {content.map((question, questionIndex) => {
          // On récupère les réponses sélectionnées pour cette question
          const answerObj = response.find(
            (r) => r.questionIndex === questionIndex
          );
          const selectedAnswers = new Set<number>(
            answerObj ? answerObj.selectedAnswers : []
          );
          const correctAnswers = new Set(
            question.answers
              .map((a, index) => (a.isCorrect ? index : -1))
              .filter((index) => index !== -1)
          );

          // Vérifie si la réponse à cette question est correcte
          const isQuestionCorrect =
            selectedAnswers.size === correctAnswers.size &&
            Array.from(selectedAnswers).every((index) =>
              correctAnswers.has(index)
            );

          return (
            <motion.div
              key={questionIndex}
              className={`bg-muted/30 rounded-lg shadow-md p-6 ${
                isQuestionCorrect
                  ? "border-l-4 border-success"
                  : "border-l-4 border-destructive"
              }`}
              variants={item}
              layout
            >
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold">
                  Question {questionIndex + 1}: {question.question}
                </h2>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isQuestionCorrect ? (
                    <CheckCircle2 className="text-success w-6 h-6" />
                  ) : (
                    <XCircle className="text-destructive w-6 h-6" />
                  )}
                </motion.div>
              </motion.div>

              <motion.div className="space-y-3">
                {question.answers.map((answer, answerIndex) => {
                  const isSelected = isAnswerSelected(
                    questionIndex,
                    answerIndex
                  );
                  const isCorrect = answer.isCorrect;

                  let borderColor = "border-muted/30";
                  let bgColor = "bg-muted";
                  let textColor = "text-muted-foreground";
                  if (isSelected && isCorrect) {
                    borderColor = "border-success";
                    bgColor = "bg-success/10";
                    textColor = "text-success";
                  } else if (isSelected && !isCorrect) {
                    borderColor = "border-destructive";
                    bgColor = "bg-destructive/10";
                    textColor = "text-destructive";
                  } else if (!isSelected && isCorrect) {
                    borderColor = "border-yellow-500";
                    bgColor = "bg-yellow-50";
                    textColor = "text-yellow-500";
                  }

                  return (
                    <motion.div
                      key={answerIndex}
                      className={`p-4 rounded-lg border ${borderColor} ${bgColor} ${textColor}`}
                      variants={answerItem}
                      custom={answerIndex}
                      initial="hidden"
                      animate="show"
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center">
                        <motion.span
                          className="ml-3"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + answerIndex * 0.05 + 0.2 }}
                        >
                          {answer.answer}
                        </motion.span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
