"use client";

import { QuestionCardProps } from "./types";

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswers,
  onAnswerToggle,
}: QuestionCardProps) {
  const isAnswerSelected = (answerIndex: number) => {
    return selectedAnswers.some(
      (answer) =>
        answer.questionIndex === questionIndex &&
        answer.selectedAnswers.includes(answerIndex)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        Question {questionIndex + 1}: {question.question}
      </h2>

      <div className="space-y-3">
        {question.answers.map((answer, answerIndex) => (
          <label
            key={answerIndex}
            htmlFor={`question-${questionIndex}-answer-${answerIndex}`}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all block ${
              isAnswerSelected(answerIndex)
                ? "border-blue-500 border-l-8 bg-blue-50 translate-x-4"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center">
              <input
                id={`question-${questionIndex}-answer-${answerIndex}`}
                type="checkbox"
                checked={isAnswerSelected(answerIndex)}
                onChange={() => onAnswerToggle(questionIndex, answerIndex)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3">{answer.answer}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
