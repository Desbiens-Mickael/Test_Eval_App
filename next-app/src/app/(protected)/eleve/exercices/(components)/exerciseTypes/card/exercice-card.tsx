"use client";

import SubmitButton from "@/components/form/submit-button";
import { DragDropContext } from "@hello-pangea/dnd";
import CardColumn from "./components/card-column";
// Ce composant permet à un élève de résoudre un exercice de type carte (drag & drop).
// Il mélange toutes les cartes au début et permet de les déposer dans les colonnes cibles.

import ButtonReset from "@/components/button-reset";
import { contentCardInput } from "@/shema-zod/exercice.shema";
import { redirect } from "next/navigation";
import StartZone from "./components/start-zone";
import { useCardExercise } from "./hooks/use-card-exercise";

interface CardExerciseProps {
  exerciceId: string;
  content: contentCardInput;
  level: string;
}

export default function ExerciceCard({
  exerciceId,
  content,
  level,
}: CardExerciseProps) {
  const {
    startCards,
    response,
    resetExercise,
    handleDragEnd,
    handleSubmit,
    isPending,
    isSuccess,
    data,
  } = useCardExercise({
    exerciceId,
    content,
    level,
  });

  if (isSuccess && data?.data) {
    redirect(`/eleve/exercices/correction/${data?.data.id}`);
  }

  return (
    <div className="w-full mx-auto px-2 sm:px-4 py-4 space-y-8">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Zone de départ avec toutes les cartes à placer */}
        <StartZone startCards={startCards} />

        {/* Affichage des colonnes où déposer les cartes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {response.map((col, idx) => (
            <CardColumn key={idx} column={col.column} cards={col.cards} />
          ))}
        </div>
        <div className="flex gap-2 sm:gap-4 p-2 sm:p-4 items-center">
          {/* Bouton pour soumettre l'exercice */}
          <SubmitButton
            onClick={handleSubmit}
            texte="Soumettre"
            isLoading={isPending}
            className="w-fit"
          />
          {/* Bouton pour réinitialiser l'exercice */}
          <ButtonReset onClick={resetExercise} isPending={isPending} />
        </div>
      </DragDropContext>
    </div>
  );
}
