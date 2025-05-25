"use client";

import { container, item } from "@/animations/exercice-and-lesson-list";
import { contentCardInput } from "@/shema-zod/exercice.shema";
import { DragDropContext } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { ExerciseActions } from "../../exercise-actions";
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
        <ExerciseActions
          textCount="Cartes placées"
          filledCount={response.reduce(
            (total, col) => total + col.cards.length,
            0
          )}
          totalCount={startCards.length}
          onReset={resetExercise}
          onSubmit={handleSubmit}
          isPending={isPending}
          disabled={
            response.reduce((total, col) => total + col.cards.length, 0) === 0
          }
        />
      </DragDropContext>
    </motion.div>
  );
}
