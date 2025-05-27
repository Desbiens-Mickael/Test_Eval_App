import { multipleChoiceResponseType } from "@/shema-zod/exercice-corection.shema";

import {
  contentMultipleChoiceInput,
  multipleChoiceInput,
} from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";

export interface MultipleChoiceExerciseProps extends baseResponseExercice {
  content: contentMultipleChoiceInput;
}

export interface AnswerEvaluationResult {
  isCorrect: boolean;
  selectedAnswers: Set<number>;
  correctAnswers: Set<number>;
}

export interface QuestionCardProps {
  question: multipleChoiceInput;
  questionIndex: number;
  selectedAnswers: multipleChoiceResponseType;
  onAnswerToggle: (questionIndex: number, answerIndex: number) => void;
}
