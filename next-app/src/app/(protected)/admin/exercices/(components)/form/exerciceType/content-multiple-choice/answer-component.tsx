"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
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
    <div className="flex items-start gap-3 group">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium",
            isCorrect 
              ? "bg-green-100 text-green-600 border border-green-200"
              : "bg-muted text-muted-foreground"
          )}>
            {String.fromCharCode(65 + answerIndex)}
          </div>
          
          <Input
            id={`answer-${index}-${answerIndex}`}
            type="text"
            placeholder="Saisissez une réponse..."
            value={answer}
            className={cn(
              "border-0 shadow-none px-0 py-1 h-auto min-h-[40px] text-base",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              isCorrect && "font-medium text-foreground"
            )}
            onChange={(e) => updateAnswer(index, answerIndex, e.target.value)}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100",
              "hover:bg-destructive/10 hover:text-destructive transition-opacity"
            )}
            onClick={() => deleteAnswer(index, answerIndex)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Supprimer la réponse</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between pl-9">
          <div className="flex items-center gap-2">
            <Switch
              id={`correct-${index}-${answerIndex}`}
              checked={isCorrect}
              onCheckedChange={(checked) => updateCorrect(index, answerIndex, checked)}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input"
            />
            <Label 
              htmlFor={`correct-${index}-${answerIndex}`}
              className={cn(
                "text-sm font-medium cursor-pointer",
                isCorrect ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {isCorrect ? "Bonne réponse" : "Marquer comme bonne réponse"}
            </Label>
          </div>
          
          {isCorrect && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Réponse correcte</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
