"use client";

import { answerVariant, container, item } from "@/animations/question-card";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
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
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <motion.h2
        initial="hidden"
        animate="show"
        variants={item}
        transition={{ delay: 0.1 }}
        className="text-xl font-semibold mb-6"
      >
        Question {questionIndex + 1}: {question.question}
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <AnimatePresence>
          {question.answers.map((answer, answerIndex) => (
            <motion.label
              key={answerIndex}
              variants={answerVariant}
              initial="hidden"
              animate={["show", isAnswerSelected(answerIndex) ? "selected" : "unselected"]}
              htmlFor={`question-${questionIndex}-answer-${answerIndex}`}
              className={`p-4 rounded-lg border-2 cursor-pointer block ${
                isAnswerSelected(answerIndex)
                  ? "border-primary border-l-8 bg-primary/5"
                  : "border-gray-200 hover:border-primary"
              }`}
            >
              <div className="flex items-center">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Checkbox
                    id={`question-${questionIndex}-answer-${answerIndex}`}
                    checked={isAnswerSelected(answerIndex)}
                    onCheckedChange={() =>
                      onAnswerToggle(questionIndex, answerIndex)
                    }
                    className="w-4 h-4 text-primary"
                  />
                </motion.div>
                <motion.span
                  className="ml-3"
                  initial="hidden"
                  animate="show"
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                >
                  {answer.answer}
                </motion.span>
              </div>
            </motion.label>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
