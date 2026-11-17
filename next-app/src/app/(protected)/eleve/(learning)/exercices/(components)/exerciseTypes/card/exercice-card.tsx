"use client";

import { container, item } from "@/animations/exercice-and-lesson-list";
import { cardItemInput, contentCardInput } from "@/shema-zod/exercice.shema";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
  ResponderProvided,
} from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { ExerciseActions } from "../../exercise-actions";
import CardColumn from "./components/card-column";
import StartZone from "./components/start-zone";
import { useCardExercise } from "./hooks/use-card-exercise";
import { zoneLabel } from "./lib/lib";

// Consignes et annonces du glisser-déposer au clavier, lues par les
// lecteurs d'écran (par défaut en anglais)
const DRAG_INSTRUCTIONS =
  "Appuyez sur Espace pour prendre la carte, utilisez les flèches pour la déplacer, Espace pour la déposer, Échap pour annuler. Vous pouvez aussi utiliser le bouton Déplacer.";


interface CardExerciseProps {
  exerciceId: string;
  content: contentCardInput;
  cards: cardItemInput[];
}

export default function ExerciceCard({
  exerciceId,
  content,
  cards,
}: CardExerciseProps) {
  const {
    startCards,
    response,
    resetExercise,
    handleDragEnd,
    moveCard,
    announcement,
    handleSubmit,
    isPending,
    isSuccess,
    data,
  } = useCardExercise({
    exerciceId,
    content,
    cards,
  });

  const columns = response.map((col) => col.column);
  const cardContent = (id: string) =>
    [...startCards, ...response.flatMap((col) => col.cards)].find((c) => c.id === id)
      ?.content ?? "";

  const onDragStart = (start: DragStart, provided: ResponderProvided) =>
    provided.announce(`Carte « ${cardContent(start.draggableId)} » prise.`);
  const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) =>
    provided.announce(
      update.destination
        ? `Au-dessus de ${zoneLabel(update.destination.droppableId)}, position ${update.destination.index + 1}.`
        : "Hors des zones de dépôt."
    );
  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const content = cardContent(result.draggableId);
    provided.announce(
      result.destination
        ? `Carte « ${content} » déposée dans ${zoneLabel(result.destination.droppableId)}.`
        : `Déplacement annulé, la carte « ${content} » reste à sa place.`
    );
    handleDragEnd(result);
  };

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
          Cartes à classer
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Glissez chaque carte dans la bonne colonne, ou utilisez le bouton
          « Déplacer » de la carte (clavier et écran tactile).
        </p>
      </motion.div>

      {/* Annonce des déplacements faits avec le bouton « Déplacer » */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
        dragHandleUsageInstructions={DRAG_INSTRUCTIONS}
      >
        {/* Zone de départ avec toutes les cartes à placer */}
        <motion.div variants={item}>
          <StartZone startCards={startCards} columns={columns} onMove={moveCard} />
        </motion.div>

        {/* Affichage des colonnes où déposer les cartes */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={container}
        >
          {response.map((col, idx) => (
            <motion.div key={idx} variants={item}>
              <CardColumn
                column={col.column}
                cards={col.cards}
                columns={columns}
                onMove={moveCard}
              />
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
