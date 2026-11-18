"use client";

import { Button } from "@/components/ui/button";
import { useSubmitExerciceResponse } from "@/hooks/mutations/exercice/use-submit-exercice-response";
import { studentOrderingContent } from "@/shema-zod/exercice.shema";
import { ArrowDown, ArrowUp } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ExerciseActions } from "../../exercise-actions";

interface ExerciceOrderingProps {
  exerciceId: string;
  content: studentOrderingContent;
}

/**
 * Exercice « Remettre dans l'ordre » : l'élève déplace chaque élément avec
 * les boutons Monter / Descendre (utilisables au clavier et au tactile).
 */
export default function ExerciceOrdering({
  exerciceId,
  content,
}: ExerciceOrderingProps) {
  // Pour chaque liste, l'ordre choisi sous forme d'index dans `items` : une clé
  // stable par élément garde le focus sur le bouton après un déplacement
  const initialOrders = () => content.map((s) => s.items.map((_, i) => i));
  const [orders, setOrders] = useState<number[][]>(initialOrders);
  // Dernier élément déplacé, pour annoncer sa nouvelle place aux lecteurs d'écran
  const [announcement, setAnnouncement] = useState("");
  const { mutateAsync, isPending, isSuccess, data } =
    useSubmitExerciceResponse();

  if (isSuccess && data?.data) {
    redirect(`/eleve/exercices/correction/${data.data.id}`);
  }

  const move = (sequenceIndex: number, rank: number, direction: -1 | 1) => {
    const order = orders[sequenceIndex];
    const target = rank + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[rank], next[target]] = [next[target], next[rank]];
    setOrders((prev) => prev.map((o, i) => (i === sequenceIndex ? next : o)));
    const item = content[sequenceIndex].items[next[target]];
    setAnnouncement(`${item} : position ${target + 1} sur ${next.length}`);
  };

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        exerciceId,
        response: orders.map((order, index) => ({
          index,
          order: order.map((itemIndex) => content[index].items[itemIndex]),
        })),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'ordre :", error);
      toast.error(
        "Une erreur est survenue lors de la validation de l'exercice"
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {content.map((sequence, sequenceIndex) => (
        <section
          key={sequenceIndex}
          aria-labelledby={`ordering-${sequenceIndex}`}
          className="rounded-xl border border-border/50 bg-card p-5 shadow-sm"
        >
          <h3
            id={`ordering-${sequenceIndex}`}
            className="mb-4 flex items-center gap-3 text-lg font-medium"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {sequenceIndex + 1}
            </span>
            {sequence.instruction}
          </h3>

          <ol className="space-y-2">
            {orders[sequenceIndex].map((itemIndex, rank, order) => {
              const item = sequence.items[itemIndex];
              return (
                <li
                  key={itemIndex}
                  className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2 pl-3"
                >
                  <span className="w-6 shrink-0 text-sm font-semibold text-muted-foreground">
                    {rank + 1}.
                  </span>
                  <span className="flex-1">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={rank === 0}
                    onClick={() => move(sequenceIndex, rank, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Monter « {item} »</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={rank === order.length - 1}
                    onClick={() => move(sequenceIndex, rank, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Descendre « {item} »</span>
                  </Button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <ExerciseActions
        textCount="Listes à remettre dans l'ordre"
        filledCount={content.length}
        totalCount={content.length}
        isPending={isPending}
        onSubmit={handleSubmit}
        onReset={() => setOrders(initialOrders())}
      />
    </div>
  );
}
