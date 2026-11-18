"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FREE_RESPONSE_MAX_POINTS,
  FREE_RESPONSE_MODEL_ANSWER_MAX_LENGTH,
  freeResponseQuestionInput,
} from "@/shema-zod/exercice.shema";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface ContentFreeResponseFormProps {
  initialValue?: freeResponseQuestionInput[];
  isEditing?: boolean;
  onChange?: (newContent: freeResponseQuestionInput[]) => void;
}

const emptyQuestion = (): freeResponseQuestionInput => ({
  question: "",
  points: 2,
  modelAnswer: "",
});

/**
 * Saisie d'un contrôle « Réponse libre » : chaque question a un barème en
 * points et, si besoin, une réponse attendue qui aide à corriger et que
 * l'élève verra une fois sa copie notée.
 */
export default function ContentFreeResponseForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentFreeResponseFormProps) {
  const [questions, setQuestions] = useState<freeResponseQuestionInput[]>(
    initialValue?.length ? initialValue : [emptyQuestion()]
  );

  useEffect(() => {
    onChange?.(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const update = (index: number, patch: Partial<freeResponseQuestionInput>) =>
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));

  const total = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="space-y-2 rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-pre-wrap font-medium">
                {index + 1}. {q.question || "Question sans titre"}
              </p>
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {q.points} pt{q.points > 1 ? "s" : ""}
              </span>
            </div>
            {q.modelAnswer && (
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                Réponse attendue : {q.modelAnswer}
              </p>
            )}
          </div>
        ))}
        <p className="text-right text-sm text-muted-foreground">Total : {total} points</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        L&apos;élève rédige sa réponse à chaque question. Vous corrigez ensuite chaque copie en
        donnant des points par question ; la note est ramenée sur le coefficient du niveau. La
        copie ne compte dans aucune moyenne tant qu&apos;elle n&apos;est pas corrigée.
      </p>

      {questions.map((q, index) => (
        <fieldset key={index} className="space-y-3 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <legend className="font-medium">Question {index + 1}</legend>
            {questions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/20 hover:text-destructive"
                onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer la question {index + 1}</span>
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`free-question-${index}`}>Énoncé</Label>
            <Textarea
              id={`free-question-${index}`}
              rows={2}
              placeholder="Ex : Explique pourquoi le Soleil brille."
              value={q.question}
              onChange={(e) => update(index, { question: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor={`free-points-${index}`}>Barème</Label>
            <Input
              id={`free-points-${index}`}
              type="number"
              inputMode="numeric"
              min={1}
              max={FREE_RESPONSE_MAX_POINTS}
              step={1}
              className="w-20 text-right"
              value={Number.isNaN(q.points) ? "" : q.points}
              onChange={(e) => update(index, { points: e.target.valueAsNumber })}
            />
            <span className="text-sm text-muted-foreground">points</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`free-model-${index}`}>Réponse attendue (facultative)</Label>
            <Textarea
              id={`free-model-${index}`}
              rows={2}
              maxLength={FREE_RESPONSE_MODEL_ANSWER_MAX_LENGTH}
              placeholder="Les éléments que vous attendez : elle vous aide à corriger et l'élève la verra une fois sa copie notée."
              value={q.modelAnswer}
              onChange={(e) => update(index, { modelAnswer: e.target.value })}
            />
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-dashed text-muted-foreground hover:text-foreground"
          onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter une question
        </Button>
        <p className="text-sm text-muted-foreground">Total : {total} points</p>
      </div>
    </div>
  );
}
