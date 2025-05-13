import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { calculateNote } from "@/lib/utils";
import { cardResponseItemType } from "@/shema-zod/exercice-corection.shema";
import { cardItemInput, contentCardInput } from "@/shema-zod/exercice.shema";
import { DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { shuffleArray } from "../lib/lib";

interface UseCardExerciseProps {
  exerciceId: string;
  content: contentCardInput;
  level: string;
}

export function useCardExercise({
  exerciceId,
  content,
  level,
}: UseCardExerciseProps) {
  const [startCards, setStartCards] = useState<cardItemInput[]>([]);
  const [response, setResponse] = useState<cardResponseItemType[]>([]);

  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
    data,
  } = useAddExerciceResponse();

  const resetExercise = useCallback(() => {
    const allCards = content.flatMap((col) => col.cards);
    setStartCards(shuffleArray(allCards));
    setResponse(content.map((col) => ({ column: col.column, cards: [] })));
  }, [content]);

  useEffect(() => {
    resetExercise();
  }, [content, resetExercise]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === "start" && destination.droppableId === "start") {
      const newCards = Array.from(startCards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);
      setStartCards(newCards);
      return;
    }

    if (source.droppableId === "start") {
      const card = startCards[source.index];
      const newStart = Array.from(startCards);
      newStart.splice(source.index, 1);
      const newResponse = response.map((col) => {
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

    if (destination.droppableId === "start") {
      const sourceColIdx = response.findIndex(
        (col) => col.column === source.droppableId
      );
      if (sourceColIdx !== -1) {
        const sourceCol = response[sourceColIdx];
        const card = sourceCol.cards[source.index];
        setStartCards([
          ...startCards.slice(0, destination.index),
          card,
          ...startCards.slice(destination.index),
        ]);
        const newResponse = [...response];
        newResponse[sourceColIdx] = {
          ...sourceCol,
          cards: sourceCol.cards.filter((_, i) => i !== source.index),
        };
        setResponse(newResponse);
        return;
      }
    }

    const sourceColIdx = response.findIndex(
      (col) => col.column === source.droppableId
    );
    const destColIdx = response.findIndex(
      (col) => col.column === destination.droppableId
    );

    if (sourceColIdx !== -1 && destColIdx !== -1) {
      const sourceCol = response[sourceColIdx];
      const card = sourceCol.cards[source.index];
      let newResponse = [...response];
      newResponse[sourceColIdx] = {
        ...sourceCol,
        cards: sourceCol.cards.filter((_, i) => i !== source.index),
      };
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

  const handleSubmit = async () => {
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

    const { note, coeficient } = calculateNote({
      level,
      maxCorrectAnswers,
      correctAnswers,
    });

    await addExerciceResponse({
      exerciceId,
      note,
      coeficient,
      response,
    });
  };

  return {
    startCards,
    response,
    isPending,
    isSuccess,
    data,
    handleDragEnd,
    handleSubmit,
    resetExercise,
  };
}
