"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitExerciceResponse } from "@/hooks/mutations/exercice/use-submit-exercice-response";
import { cn } from "@/lib/utils";
import { studentMatchingPairsContent } from "@/shema-zod/exercice.shema";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ExerciseActions } from "../../exercise-actions";

interface ExerciceMatchingPairsProps {
  exerciceId: string;
  content: studentMatchingPairsContent;
}

/**
 * Exercice « Associer par paires » : pour chaque élément de gauche, l'élève
 * choisit l'élément de droite qui lui correspond dans une liste déroulante.
 * Un élément de droite déjà choisi est signalé mais reste sélectionnable,
 * pour que l'élève puisse corriger dans n'importe quel ordre.
 */
export default function ExerciceMatchingPairs({
  exerciceId,
  content,
}: ExerciceMatchingPairsProps) {
  // Pour chaque élément de gauche, l'index de l'élément de droite choisi
  const [choices, setChoices] = useState<(number | null)[]>(() =>
    content.lefts.map(() => null)
  );
  const [showMissing, setShowMissing] = useState(false);
  const { mutateAsync, isPending, isSuccess, data } =
    useSubmitExerciceResponse();

  if (isSuccess && data?.data) {
    redirect(`/eleve/exercices/correction/${data.data.id}`);
  }

  const filledCount = choices.filter((c) => c !== null).length;
  const usedRights = new Set(choices.filter((c): c is number => c !== null));

  const choose = (leftIndex: number, rightIndex: number) =>
    setChoices((prev) =>
      prev.map((c, i) => (i === leftIndex ? rightIndex : c))
    );

  const handleSubmit = async () => {
    if (filledCount < content.lefts.length) {
      setShowMissing(true);
      toast.error("Associe chaque élément avant d'envoyer ta réponse");
      return;
    }
    try {
      await mutateAsync({
        exerciceId,
        response: choices.map((rightIndex, index) => ({
          index,
          answer: content.rights[rightIndex as number],
        })),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi des paires :", error);
      toast.error(
        "Une erreur est survenue lors de la validation de l'exercice"
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ul className="space-y-3">
        {content.lefts.map((left, index) => {
          const choice = choices[index];
          const isMissing = showMissing && choice === null;
          return (
            <li
              key={index}
              className={cn(
                "grid grid-cols-1 items-center gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-[1fr_auto_1fr]",
                isMissing ? "border-destructive/50" : "border-border/50"
              )}
            >
              <span id={`pair-left-${index}`} className="font-medium">
                {left}
              </span>
              <ArrowRight
                className="hidden h-4 w-4 text-muted-foreground sm:block"
                aria-hidden
              />
              <Select
                value={choice === null ? undefined : String(choice)}
                onValueChange={(value) => choose(index, Number(value))}
              >
                <SelectTrigger
                  aria-labelledby={`pair-left-${index}`}
                  aria-invalid={isMissing}
                >
                  <SelectValue placeholder="Choisis la réponse" />
                </SelectTrigger>
                <SelectContent>
                  {content.rights.map((right, rightIndex) => (
                    <SelectItem key={rightIndex} value={String(rightIndex)}>
                      {right}
                      {usedRights.has(rightIndex) && choice !== rightIndex && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (déjà choisi)
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
          );
        })}
      </ul>

      <ExerciseActions
        textCount="Paires associées"
        filledCount={filledCount}
        totalCount={content.lefts.length}
        isPending={isPending}
        onSubmit={handleSubmit}
        onReset={() => {
          setChoices(content.lefts.map(() => null));
          setShowMissing(false);
        }}
      />
    </div>
  );
}
