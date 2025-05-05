"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCallback } from "react";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

export default function AnswerList() {
  const { removeAnswer, content } = useContentGapFillTextStore();

  const handleAnswerRemove = useCallback(
    (position: number) => {
      const removedAnswer = content.answers?.find(
        (answer) => answer.position === position
      );
      if (!removedAnswer) return;

      // Restaurer le mot original dans content.text
      const updatedText = [...content.text];
      updatedText[position] = removedAnswer.answer;

      removeAnswer(position);
    },
    [content, removeAnswer]
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">Réponses : </span>
      <div className="flex flex-wrap gap-2">
        {content?.answers.map((answer) => (
          <Badge
            key={answer.position}
            variant={"outline"}
            className="inline-flex items-center text-sm text-muted-foreground"
          >
            <Button
              type="button"
              className="size-fit p-1 text-destructive bg-transparent hover:bg-destructive/30 hover:text-destructive focus:text-destructive transition-colors"
              onClick={() => handleAnswerRemove(answer.position)}
            >
              <X size={16} />
            </Button>
            {answer.answer}
          </Badge>
        ))}
      </div>
    </div>
  );
}
