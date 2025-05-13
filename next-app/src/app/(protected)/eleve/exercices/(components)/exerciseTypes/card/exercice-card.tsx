"use client";

import SubmitButton from "@/components/form/submit-button";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import CardColumn from "./card-column";
// Ce composant permet à un élève de résoudre un exercice de type carte (drag & drop).
// Il mélange toutes les cartes au début et permet de les déposer dans les colonnes cibles.

import ButtonReset from "@/components/button-reset";
import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { calculateNote } from "@/lib/utils";
import { cardResponseItemType } from "@/shema-zod/exercice-corection.shema";
import { cardItemInput, contentCardInput } from "@/shema-zod/exercice.shema";
import { redirect } from "next/navigation";

// Props du composant :
// - exerciceId : l'identifiant de l'exercice
// - content : la structure de l'exercice (colonnes et cartes)
// - level : le niveau de difficulté (optionnel)
interface CardExerciseProps {
  exerciceId: string;
  content: contentCardInput;
  level: string;
}

// Fonction utilitaire pour mélanger un tableau (algorithme de Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Composant principal pour l'exercice carte
export default function ExerciceCard({
  exerciceId,
  content,
  level,
}: CardExerciseProps) {
  // Mélanger toutes les cartes au début
  // State pour les cartes de départ (toutes mélangées)
  const [startCards, setStartCards] = useState<cardItemInput[]>([]);
  // State pour les colonnes (où l'élève dépose les cartes)
  const [response, setResponse] = useState<cardResponseItemType[]>([]);

  // Hook pour envoyer la réponse à l'API (mutation async)
  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
    data,
  } = useAddExerciceResponse();

  // Fonction utilitaire pour réinitialiser l'exercice (remettre toutes les cartes dans la zone de départ)
  const resetExercise = () => {
    const allCards = content.flatMap((col) => col.cards);
    setStartCards(shuffle(allCards));
    setResponse(content.map((col) => ({ column: col.column, cards: [] })));
  };

  useEffect(() => {
    // À l'initialisation :
    // - On rassemble toutes les cartes de toutes les colonnes
    // - On les mélange et on les place dans la zone de départ
    // - On prépare les colonnes vides (prêtes à recevoir les cartes)
    resetExercise();
  }, [content]);

  // Fonction appelée à chaque fois qu'une carte est déplacée (drag & drop)
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // Si la carte n'a pas de destination valide, on ne fait rien
    if (!destination) return;
    // Gestion du déplacement d'une carte dans la zone de départ (réorganisation)
    if (source.droppableId === "start" && destination.droppableId === "start") {
      const newCards = Array.from(startCards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);
      setStartCards(newCards);
      return;
    }
    // Gestion du déplacement d'une carte de la zone de départ vers une colonne
    if (source.droppableId === "start") {
      const card = startCards[source.index];
      const newStart = Array.from(startCards);
      newStart.splice(source.index, 1);
      const newResponse = response.map((col, idx) => {
        if (destination.droppableId === col.column) {
          return {
            ...col,
            cards: [
              ...col.cards.slice(0, destination.index),
              card,
              ...col.cards.slice(destination.index),
            ],
          };
        }
        return col;
      });
      setStartCards(newStart);
      setResponse(newResponse);
      return;
    }
    // Gestion du déplacement d'une carte d'une colonne vers la zone de départ
    if (destination.droppableId === "start") {
      const sourceColIdx = response.findIndex(
        (col) => col.column === source.droppableId
      );
      if (sourceColIdx !== -1) {
        const sourceCol = response[sourceColIdx];
        const card = sourceCol.cards[source.index];
        // Ajouter la carte à la zone de départ
        setStartCards([
          ...startCards.slice(0, destination.index),
          card,
          ...startCards.slice(destination.index),
        ]);
        // Retirer la carte de la colonne source
        const newResponse = [...response];
        newResponse[sourceColIdx] = {
          ...sourceCol,
          cards: sourceCol.cards.filter((_, i) => i !== source.index),
        };
        setResponse(newResponse);
        return;
      }
    }

    // Gestion du déplacement d'une carte d'une colonne à une autre
    const sourceColIdx = response.findIndex(
      (col) => col.column === source.droppableId
    );
    const destColIdx = response.findIndex(
      (col) => col.column === destination.droppableId
    );
    if (sourceColIdx !== -1 && destColIdx !== -1) {
      // On récupère la colonne source et la carte déplacée
      const sourceCol = response[sourceColIdx];
      const card = sourceCol.cards[source.index];
      // On crée une copie des colonnes pour éviter de muter l'état directement
      let newResponse = [...response];
      // On retire la carte de la colonne source
      newResponse[sourceColIdx] = {
        ...sourceCol,
        cards: sourceCol.cards.filter((_, i) => i !== source.index),
      };
      // Ajouter la carte à la colonne destination
      newResponse[destColIdx] = {
        ...newResponse[destColIdx],
        cards: [
          ...newResponse[destColIdx].cards.slice(0, destination.index),
          card,
          ...newResponse[destColIdx].cards.slice(destination.index),
        ],
      };
      setResponse(newResponse);
    }
  };

  // Fonction appelée lors du clic sur le bouton Soumettre
  const handleSubmit = async () => {
    // vérifier si les valeurs des cartes se trouvent dans la colonne correspondante
    const correctAnswersByColumn = content.map((col) => {
      const colResponse = response.find((r) => r.column === col.column);
      if (!colResponse) return 0;
      return col.cards.filter((card) =>
        colResponse.cards.some((rCard) => rCard.id === card.id)
      ).length;
    });

    const maxCorrectAnswers = content
      .map((col) => col.cards.length)
      .reduce((a, b) => a + b, 0);
    const correctAnswers = correctAnswersByColumn.reduce((a, b) => a + b, 0);

    // Calcul de la note
    const { note, coeficient } = calculateNote({
      level,
      maxCorrectAnswers,
      correctAnswers,
    });

    // Puis envoyer la réponse à l'API (décommenter quand prêt)
    await addExerciceResponse({
      exerciceId,
      note,
      coeficient,
      response,
    });
  };

  if (isSuccess && data?.data) {
    redirect(`/eleve/exercices/correction/${data?.data.id}`);
  }

  // Affichage du composant
  return (
    // Conteneur principal responsive : padding réduit sur mobile, max-width adaptée
    <div className="w-full mx-auto px-2 sm:px-4 py-4 space-y-8">
      {/* Si l'exercice n'est pas encore soumis, on affiche le drag & drop */}
      {/* {!isSuccess ? ( */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Zone de départ avec toutes les cartes à placer */}
        <div className="mb-8 relative z-50">
          <h2 className="font-bold text-lg text-blue-800 mb-4 tracking-tight flex items-center gap-2">
            Cartes à placer
          </h2>
          <Droppable droppableId="start" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`max-w-[calc(100%-2rem)] flex flex-wrap gap-2 sm:gap-3 border-2 p-2 sm:p-4 rounded-xl min-h-[70px] transition-all duration-200 ${
                  snapshot.isDraggingOver
                    ? "border-transparent bg-blue-100/70 shadow-lg"
                    : "border-gray-200 bg-gradient-to-r from-blue-50 to-white shadow-inner"
                }`}
              >
                {startCards.length === 0 && (
                  <span className="text-gray-400 italic">
                    Toutes les cartes ont été placées !
                  </span>
                )}
                {startCards.map((card, idx) => (
                  <Draggable key={card.id} draggableId={card.id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white border-2 ${
                          snapshot.isDragging
                            ? "border-blue-400 shadow-lg "
                            : "border-gray-200 shadow"
                        } px-5 py-3 rounded-xl cursor-grab font-semibold text-blue-900 transition-all duration-150 hover:bg-blue-50 hover:shadow-xl select-none`}
                        style={{
                          ...provided.draggableProps.style,
                          zIndex: snapshot.isDragging ? 100 : 1,
                          touchAction: "none",
                        }}
                      >
                        {/* Icône de déplacement */}
                        <span className="inline-block align-middle mr-2 text-blue-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8h16M4 16h16"
                            />
                          </svg>
                        </span>
                        {card.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        {/* Affichage des colonnes où déposer les cartes */}
        {/* Colonnes responsive : 1 colonne sur mobile, 2 à 3 sur desktop  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {response.map((col, idx) => (
            <CardColumn key={idx} column={col.column} cards={col.cards} />
          ))}
        </div>
        <div className="flex gap-2 sm:gap-4 p-2 sm:p-4 items-center">
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
      {/* // ) : (
      //   <ExerciceResultCard content={content} response={response} />
      // )} */}
    </div>
  );
}
