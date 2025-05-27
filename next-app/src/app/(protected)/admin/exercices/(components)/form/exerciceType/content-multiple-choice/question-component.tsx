"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import AnswerComponent from "./answer-component";
import { useContentMultipleChoiceStore } from "./store/store-content-multiple-choice";

interface QuestionComponentProps {
  question: multipleChoiceInput;
  index: number;
}

export default function QuestionComponent({
  question,
  index,
}: QuestionComponentProps) {
  const { addAnswer, deleteQuestion, updateQuestion } =
    useContentMultipleChoiceStore();

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <Label className="text-sm font-medium text-muted-foreground" htmlFor={`question-${index}`}>
            Question {index + 1}
          </Label>
          <Input
            id={`question-${index}`}
            type="text"
            placeholder="Entrez la question"
            value={question.question}
            className="text-base border-0 shadow-none focus-visible:ring-0 p-0 h-auto min-h-[40px]"
            onChange={(e) => updateQuestion(index, e.target.value)}
          />
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => deleteQuestion(index)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer la question</span>
        </Button>
      </div>

      <div className="space-y-3 pl-2">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">Reponses</span>
          <Button
            type="button"
            className="size-fit p-1"
            onClick={() => {
              addAnswer(index);
            }}
          >
            <Plus size={20} />
          </Button>
        </div>
        {question.answers.map((answer, answerIndex) => (
          <AnswerComponent
            key={answerIndex}
            index={index}
            answerIndex={answerIndex}
            answer={answer.answer}
            isCorrect={answer.isCorrect}
          />
        ))}
      </div>
    </div>
  );
}
