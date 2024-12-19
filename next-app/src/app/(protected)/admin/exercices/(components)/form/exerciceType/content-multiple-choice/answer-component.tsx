"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useContentMultipleChoiceStore } from "./store/store-content-multiple-choice";

interface AnswerComponentProps {
  index: number;
  answerIndex: number;
  answer: string;
  isCorrect: boolean;
}

export default function AnswerComponent({
  index,
  answerIndex,
  answer,
  isCorrect,
}: AnswerComponentProps) {
  const { updateAnswer, updateCorrect, deleteAnswer } =
    useContentMultipleChoiceStore();

  return (
    <div className="flex gap-4">
      <div key={answerIndex} className="flex flex-col gap-2 grow">
        <Label className="mb-1" htmlFor={`answer-${index}-${answerIndex}`}>
          Reponse {answerIndex + 1}
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            className="size-fit p-1 ms-2 text-destructive bg-transparent hover:bg-destructive/30 hover:text-destructive focus:text-destructive transition-colors"
            onClick={() => {
              deleteAnswer(index, answerIndex);
            }}
          >
            <X size={20} />
          </Button>
          <Input
            id={`answer-${index}-${answerIndex}`}
            type="text"
            placeholder="Entrez la reponse"
            value={answer}
            onChange={(e) => {
              updateAnswer(index, answerIndex, e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Label className="mb-1" htmlFor={`correct-${index}-${answerIndex}`}>
          Correct
        </Label>
        <div className="flex justify-center items-center grow pt-2">
          <Switch
            id={`correct-${index}-${answerIndex}`}
            checked={isCorrect}
            onCheckedChange={(value) => {
              updateCorrect(index, answerIndex, value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
