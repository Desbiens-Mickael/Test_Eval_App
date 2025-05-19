"use client";

import { multipleChoiceResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentMultipleChoiceInput } from "@/shema-zod/exercice.shema";
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
    <div className="w-full max-w-2xl mx-auto p-4 space-y-8">
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
          <div
            key={questionIndex}
            className={`bg-white rounded-lg shadow-md p-6 ${
              isQuestionCorrect
                ? "border-l-4 border-green-500"
                : "border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">
                Question {questionIndex + 1}: {question.question}
              </h2>
              {isQuestionCorrect ? (
                <CheckCircle2 className="text-green-500 w-6 h-6" />
              ) : (
                <XCircle className="text-red-500 w-6 h-6" />
              )}
            </div>

            <div className="space-y-3">
              {question.answers.map((answer, answerIndex) => {
                const isSelected = isAnswerSelected(questionIndex, answerIndex);
                const isCorrect = answer.isCorrect;

                let borderColor = "border-gray-200";
                let bgColor = "bg-white";
                if (isSelected && isCorrect) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-50";
                } else if (isSelected && !isCorrect) {
                  borderColor = "border-red-500";
                  bgColor = "bg-red-50";
                } else if (!isSelected && isCorrect) {
                  borderColor = "border-yellow-500";
                  bgColor = "bg-yellow-50";
                }

                return (
                  <div
                    key={answerIndex}
                    className={`p-4 rounded-lg border-2 ${borderColor} ${bgColor}`}
                  >
                    <div className="flex items-center">
                      <span className="ml-3">{answer.answer}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
