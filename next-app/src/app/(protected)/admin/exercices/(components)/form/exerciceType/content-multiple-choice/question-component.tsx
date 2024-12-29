"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { Plus, Trash2 } from "lucide-react";
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
    <div className="flex flex-col gap-2 border border-dashed border-primary-200 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-bold" htmlFor={`question-${index}`}>
          Question {index + 1}
        </Label>
        <Button
          type="button"
          className="size-fit p-1 ms-2 text-destructive bg-transparent hover:bg-destructive/30 hover:text-destructive focus:text-destructive transition-colors"
          onClick={() => {
            deleteQuestion(index);
          }}
        >
          <Trash2 size={20} />
        </Button>
      </div>
      <div className="flex item-center gap-2">
        <Input
          id={`question-${index}`}
          type="text"
          placeholder="Entrez la question"
          value={question.question}
          onChange={(e) => {
            updateQuestion(index, e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col gap-4 border border-slate-200 p-4 rounded-lg ms-8">
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
