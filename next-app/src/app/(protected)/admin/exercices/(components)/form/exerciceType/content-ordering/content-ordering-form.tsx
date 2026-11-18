"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderingSequenceInput } from "@/shema-zod/exercice.shema";
import { ArrowDown, ArrowUp, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface ContentOrderingFormProps {
  initialValue?: orderingSequenceInput[];
  isEditing?: boolean;
  onChange?: (newContent: orderingSequenceInput[]) => void;
}

const emptySequence = (): orderingSequenceInput => ({
  instruction: "",
  items: ["", "", ""],
});

/** Déplace un élément d'un cran vers le haut (-1) ou le bas (+1) */
const move = <T,>(items: T[], index: number, direction: -1 | 1): T[] => {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const result = [...items];
  [result[index], result[target]] = [result[target], result[index]];
  return result;
};

/**
 * Saisie d'un exercice « Remettre dans l'ordre ».
 * Le professeur écrit chaque liste dans le bon ordre ; l'élève la recevra mélangée.
 */
export default function ContentOrderingForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentOrderingFormProps) {
  const [sequences, setSequences] = useState<orderingSequenceInput[]>(
    initialValue?.length ? initialValue : [emptySequence()]
  );

  useEffect(() => {
    onChange?.(sequences);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequences]);

  const updateSequence = (
    index: number,
    update: (s: orderingSequenceInput) => orderingSequenceInput
  ) =>
    setSequences((prev) => prev.map((s, i) => (i === index ? update(s) : s)));

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {sequences.map((sequence, index) => (
          <div key={index} className="rounded-lg border bg-card p-4">
            <p className="mb-3 font-medium">
              {sequence.instruction || "Consigne"}
            </p>
            <ol className="list-decimal space-y-1 pl-6">
              {sequence.items.map((item, rank) => (
                <li key={rank}>{item || "—"}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Écrivez les éléments <strong>dans le bon ordre</strong>. L&apos;élève
        les recevra mélangés et devra les remettre dans cet ordre. Chaque
        élément bien placé rapporte un point.
      </p>

      {sequences.map((sequence, index) => (
        <fieldset
          key={index}
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <legend className="sr-only">Liste {index + 1}</legend>
          <div className="flex items-center gap-2">
            <Input
              aria-label={`Consigne de la liste ${index + 1}`}
              placeholder="Ex : Range les nombres du plus petit au plus grand"
              value={sequence.instruction}
              onChange={(e) =>
                updateSequence(index, (s) => ({
                  ...s,
                  instruction: e.target.value,
                }))
              }
            />
            {sequences.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:bg-destructive/20 hover:text-destructive"
                onClick={() =>
                  setSequences((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer la liste {index + 1}</span>
              </Button>
            )}
          </div>

          <ol className="space-y-2">
            {sequence.items.map((item, rank) => (
              <li key={rank} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-right text-sm font-semibold text-muted-foreground">
                  {rank + 1}.
                </span>
                <Input
                  aria-label={`Liste ${index + 1}, élément ${rank + 1}`}
                  value={item}
                  onChange={(e) =>
                    updateSequence(index, (s) => ({
                      ...s,
                      items: s.items.map((it, r) =>
                        r === rank ? e.target.value : it
                      ),
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  disabled={rank === 0}
                  onClick={() =>
                    updateSequence(index, (s) => ({
                      ...s,
                      items: move(s.items, rank, -1),
                    }))
                  }
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="sr-only">
                    Monter l&apos;élément {rank + 1}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  disabled={rank === sequence.items.length - 1}
                  onClick={() =>
                    updateSequence(index, (s) => ({
                      ...s,
                      items: move(s.items, rank, 1),
                    }))
                  }
                >
                  <ArrowDown className="h-4 w-4" />
                  <span className="sr-only">
                    Descendre l&apos;élément {rank + 1}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:bg-destructive/20 hover:text-destructive"
                  disabled={sequence.items.length <= 2}
                  onClick={() =>
                    updateSequence(index, (s) => ({
                      ...s,
                      items: s.items.filter((_, r) => r !== rank),
                    }))
                  }
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">
                    Supprimer l&apos;élément {rank + 1}
                  </span>
                </Button>
              </li>
            ))}
          </ol>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() =>
              updateSequence(index, (s) => ({ ...s, items: [...s.items, ""] }))
            }
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter un élément
          </Button>
        </fieldset>
      ))}

      <Button
        type="button"
        variant="outline"
        className="gap-2 border-dashed text-muted-foreground hover:text-foreground"
        onClick={() => setSequences((prev) => [...prev, emptySequence()])}
      >
        <PlusCircle className="h-4 w-4" />
        Ajouter une liste
      </Button>
    </div>
  );
}
