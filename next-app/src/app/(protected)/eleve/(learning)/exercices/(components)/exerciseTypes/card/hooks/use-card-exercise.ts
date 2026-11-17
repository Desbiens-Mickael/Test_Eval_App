import { useSubmitExerciceResponse } from "@/hooks/mutations/exercice/use-submit-exercice-response";
import { cardResponseItemType } from "@/shema-zod/exercice-corection.shema";
import { cardItemInput, contentCardInput } from "@/shema-zod/exercice.shema";
import { DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { moveCardToZone, shuffleArray, zoneLabel } from "../lib/lib";

interface UseCardExerciseProps {
  exerciceId: string;
  content: contentCardInput;
  cards: cardItemInput[];
}

export function useCardExercise({
  exerciceId,
  content,
  cards,
}: UseCardExerciseProps) {
  const [startCards, setStartCards] = useState<cardItemInput[]>([]);
  const [response, setResponse] = useState<cardResponseItemType[]>([]);
  // Message lu par les lecteurs d'écran après un déplacement par le menu
  const [announcement, setAnnouncement] = useState("");

  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
    data,
  } = useSubmitExerciceResponse();

  const resetExercise = useCallback(() => {
    setStartCards(shuffleArray(cards));
    setResponse(content.map((col) => ({ column: col.column, cards: [] })));
  }, [content, cards]);

  useEffect(() => {
    resetExercise();
  }, [resetExercise]);

  const applyMove = (cardId: string, destination: string, index?: number) => {
    const board = moveCardToZone({ startCards, response }, cardId, destination, index);
    setStartCards(board.startCards);
    setResponse(board.response);
  };

  // Glisser-déposer (souris, clavier, tactile)
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    applyMove(
      result.draggableId,
      result.destination.droppableId,
      result.destination.index
    );
  };

  // Bouton « Déplacer » : alternative sans glisser
  const moveCard = (cardId: string, destination: string) => {
    const card = [...startCards, ...response.flatMap((col) => col.cards)].find(
      (c) => c.id === cardId
    );
    applyMove(cardId, destination);
    if (card) {
      setAnnouncement(`Carte « ${card.content} » déplacée dans ${zoneLabel(destination)}.`);
    }
  };

  // La note est calculée côté serveur
  const handleSubmit = async () => {
    await addExerciceResponse({
      exerciceId,
      response,
    });
  };

  return {
    startCards,
    response,
    announcement,
    isPending,
    isSuccess,
    data,
    handleDragEnd,
    moveCard,
    handleSubmit,
    resetExercise,
  };
}
