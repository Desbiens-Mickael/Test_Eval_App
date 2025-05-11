"use client";

import React from "react";

interface TrueFalseQuestionProps {
  question: string;
  index: number;
  currentAnswer: boolean | null;
  onAnswerChange: (answer: boolean) => void;
  isError: boolean;
}

const TrueFalseQuestion = React.memo(
  ({
    question,
    index,
    currentAnswer,
    onAnswerChange,
    isError,
  }: TrueFalseQuestionProps) => {
    return (
      <div
        className={`
      bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
      ${isError ? "border-red-500 dark:border-red-700" : "dark:border-gray-700"}
    `}
      >
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {`${index + 1}. ${question}`}
        </p>
        <div className="flex items-center gap-4">
          {[true, false].map((value) => (
            <label
              key={value.toString()}
              className={`
            flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
            transition-all duration-200 ease-in-out
            ${
              currentAnswer === value
                ? value
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
            >
              <input
                type="radio"
                name={`question-${index}`}
                value={value.toString()}
                className="hidden"
                checked={currentAnswer === value}
                onChange={() => onAnswerChange(value)}
              />
              <span className="font-semibold">{value ? "Vrai" : "Faux"}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
);

TrueFalseQuestion.displayName = "TrueFalseQuestion";

export default TrueFalseQuestion;
