"use client";

import { container, item } from "@/animations/exercice-and-lesson-list";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { contentCardInput } from "@/shema-zod/exercice.shema";
import { DragDropContext } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { redirect } from "next/navigation";
import CardColumn from "./components/card-column";
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
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* En-tête */}
      <motion.div className="flex flex-col gap-3" variants={item}>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Exercice de cartes
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Glissez et déposez les éléments dans les colonnes correspondantes
        </p>
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Zone de départ avec toutes les cartes à placer */}
        <motion.div variants={item}>
          <StartZone startCards={startCards} />
        </motion.div>

        {/* Affichage des colonnes où déposer les cartes */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={container}
        >
          {response.map((col, idx) => (
            <motion.div key={idx} variants={item}>
              <CardColumn column={col.column} cards={col.cards} />
            </motion.div>
          ))}
        </motion.div>

        {/* Zone des boutons d'action */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-xl border border-border shadow-sm"
          variants={item}
        >
          <div className="flex-1 flex items-center">
            <div className="inline-flex items-center px-4 py-2 bg-background rounded-full border border-border shadow-sm">
              <span className="font-medium text-foreground">
                <span className="font-bold text-lg">
                  {response.reduce((total, col) => total + col.cards.length, 0)}
                </span>
                <span className="mx-1">/</span>
                <span className="text-primary">{startCards.length}</span>
                <span className="ml-2 text-sm font-normal">cartes placées</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <Button
              onClick={resetExercise}
              variant="outline"
              size="lg"
              disabled={isPending}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
            <SubmitButton
              onClick={handleSubmit}
              texte="Valider"
              isLoading={isPending}
              className="w-full lg:w-auto shadow-md hover:shadow-lg transition-all"
              disabled={
                response.reduce((total, col) => total + col.cards.length, 0) ===
                0
              }
            />
          </div>
        </motion.div>
      </DragDropContext>
    </motion.div>
  );
}
