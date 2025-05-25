"use client";

import { motion } from "framer-motion";
import React from "react";

// Animation variants
const buttonVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.03,
    y: -2,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    y: 1,
  },
  selected: {
    scale: 1.02,
    y: 0,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

// Colors based on app's color scheme
const getButtonColors = (
  isSelected: boolean,
  isTrue: boolean,
  isError: boolean
) => {
  if (isError && !isSelected) {
    return {
      bg: "bg-destructive/10 dark:bg-destructive/20",
      text: "text-destructive dark:text-destructive-foreground",
      border: "border-destructive/30 dark:border-destructive/50",
      hover: "hover:bg-destructive/20 dark:hover:bg-destructive/30",
    };
  }

  if (isSelected) {
    return isTrue
      ? {
          bg: "bg-green-500/10 dark:bg-green-500/20",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-500/30 dark:border-green-500/40",
          hover: "hover:bg-green-500/20 dark:hover:bg-green-500/30",
        }
      : {
          bg: "bg-destructive/10 dark:bg-destructive/20",
          text: "text-destructive dark:text-destructive-foreground",
          border: "border-destructive/30 dark:border-destructive/50",
          hover: "hover:bg-destructive/20 dark:hover:bg-destructive/30",
        };
  }

  return {
    bg: "bg-muted/50 dark:bg-muted/30",
    text: "text-muted-foreground/80 dark:text-muted-foreground/90",
    border: "border-border/50 dark:border-border/50",
    hover: "hover:bg-muted/80 dark:hover:bg-muted/50",
  };
};

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          bg-card text-card-foreground p-6 rounded-xl border shadow-sm
          ${isError ? "border-destructive/50" : "border-border/50"}
          transition-all duration-200
        `}
      >
        <p className="text-lg font-medium mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {index + 1}
          </span>
          <span>{question}</span>
        </p>
        <div className="flex items-center gap-4">
          {[true, false].map((value) => {
            const isSelected = currentAnswer === value;
            const colors = getButtonColors(
              isSelected,
              value,
              isError && currentAnswer === null
            );

            return (
              <motion.label
                key={value.toString()}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                  border transition-colors duration-200
                  ${colors.bg} ${colors.text} ${colors.border} ${colors.hover}
                  font-medium
                `}
                variants={buttonVariants}
                initial="initial"
                whileHover={!isSelected ? "hover" : undefined}
                whileTap="tap"
                animate={isSelected ? "selected" : "initial"}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={value.toString()}
                  className="hidden"
                  checked={isSelected}
                  onChange={() => onAnswerChange(value)}
                />
                <span className="font-semibold">{value ? "Vrai" : "Faux"}</span>
              </motion.label>
            );
          })}
        </div>
      </motion.div>
    );
  }
);

TrueFalseQuestion.displayName = "TrueFalseQuestion";

export default TrueFalseQuestion;
