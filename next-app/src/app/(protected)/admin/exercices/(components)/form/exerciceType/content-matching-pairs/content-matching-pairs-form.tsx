"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { matchingPairInput } from "@/shema-zod/exercice.shema";
import { ArrowLeftRight, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface ContentMatchingPairsFormProps {
  initialValue?: matchingPairInput[];
  isEditing?: boolean;
  onChange?: (newContent: matchingPairInput[]) => void;
}

const emptyPair = (): matchingPairInput => ({ left: "", right: "" });

const defaultContent = (): matchingPairInput[] => [
  emptyPair(),
  emptyPair(),
  emptyPair(),
];

/**
 * Saisie d'un exercice « Associer par paires ».
 * Chaque ligne est une paire : l'élève verra la colonne de gauche dans cet
 * ordre et devra retrouver, dans la colonne de droite mélangée, l'élément associé.
 */
export default function ContentMatchingPairsForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentMatchingPairsFormProps) {
  const [pairs, setPairs] = useState<matchingPairInput[]>(
    initialValue?.length ? initialValue : defaultContent()
  );

  useEffect(() => {
    onChange?.(pairs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const updatePair = (
    index: number,
    side: keyof matchingPairInput,
    value: string
  ) =>
    setPairs((prev) =>
      prev.map((pair, i) => (i === index ? { ...pair, [side]: value } : pair))
    );

  const removePair = (index: number) =>
    setPairs((prev) => prev.filter((_, i) => i !== index));

  if (!isEditing) {
    return (
      <ul className="space-y-2">
        {pairs.map((pair, index) => (
          <li
            key={index}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border bg-card p-3"
          >
            <span className="font-medium">{pair.left || "—"}</span>
            <ArrowLeftRight
              className="h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <span>{pair.right || "—"}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Écrivez chaque paire sur une ligne. L&apos;élève verra la colonne de
        droite mélangée et devra associer chaque élément de gauche au bon
        élément de droite.
      </p>

      <div className="hidden grid-cols-[1fr_1fr_2.5rem] gap-3 px-1 text-sm font-medium text-muted-foreground sm:grid">
        <span>À gauche</span>
        <span>À droite (bonne réponse)</span>
      </div>

      <ol className="space-y-3">
        {pairs.map((pair, index) => (
          <li
            key={index}
            className="grid grid-cols-1 gap-2 rounded-lg border bg-card p-3 sm:grid-cols-[1fr_1fr_2.5rem] sm:items-center sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0"
          >
            <Input
              aria-label={`Paire ${index + 1} : élément de gauche`}
              placeholder="Ex : Chat"
              value={pair.left}
              onChange={(e) => updatePair(index, "left", e.target.value)}
            />
            <Input
              aria-label={`Paire ${index + 1} : élément de droite`}
              placeholder="Ex : Miaule"
              value={pair.right}
              onChange={(e) => updatePair(index, "right", e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="justify-self-end text-destructive hover:bg-destructive/20 hover:text-destructive"
              onClick={() => removePair(index)}
              disabled={pairs.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer la paire {index + 1}</span>
            </Button>
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="outline"
        className="gap-2 border-dashed text-muted-foreground hover:text-foreground"
        onClick={() => setPairs((prev) => [...prev, emptyPair()])}
      >
        <PlusCircle className="h-4 w-4" />
        Ajouter une paire
      </Button>
    </div>
  );
}
