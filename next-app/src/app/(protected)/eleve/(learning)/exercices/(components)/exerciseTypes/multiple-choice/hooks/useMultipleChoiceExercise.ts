import { MultipleChoiceExerciseProps } from "@/app/(protected)/eleve/(learning)/exercices/(components)/exerciseTypes/multiple-choice/types";
import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import {
  multipleChoiceResponseItemType,
  multipleChoiceResponseType,
} from "@/shema-zod/exercice-corection.shema";
import { noteExerciceStudent } from "@/type/exercice";
import { useState } from "react";

export const useMultipleChoiceExercise = ({
  exerciceId,
}: MultipleChoiceExerciseProps) => {
  const [selectedAnswers, setSelectedAnswers] =
    useState<multipleChoiceResponseType>([]);
  const [note, setNote] = useState<noteExerciceStudent>({
    note: 0,
    coeficient: 0,
  });

  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
    data,
  } = useAddExerciceResponse();

  const resetExercise = () => {
    setSelectedAnswers([]);
    setNote({ note: 0, coeficient: 0 });
  };

  // Fonction pour mettre à jour la sélection d'une réponse
  const updateAnswerSelection = (
    questionIndex: number,
    answerIndex: number
  ): void => {
    // On met à jour la sélection d'une réponse
    setSelectedAnswers((prevAnswers: multipleChoiceResponseType) => {
      // On copie les réponses existantes
      const updatedResponses = [...prevAnswers];

      // On trouve la réponse correspondante
      const responses = updatedResponses.find(
        (response) => response.questionIndex === questionIndex
      );

      // Si la réponse existe, on met à jour la sélection
      if (responses) {
        const updatedResponse = {
          ...responses,
          selectedAnswers: responses.selectedAnswers.includes(answerIndex)
            ? responses.selectedAnswers.filter((index) => index !== answerIndex)
            : [...responses.selectedAnswers, answerIndex],
        };
        const updatedIndex = updatedResponses.findIndex(
          (response) => response.questionIndex === questionIndex
        );
        updatedResponses[updatedIndex] = updatedResponse;
      } else {
        // Si la réponse n'existe pas, on la crée
        const newResponse: multipleChoiceResponseItemType = {
          questionIndex,
          selectedAnswers: [answerIndex],
        };
        updatedResponses.push(newResponse);
      }

      return updatedResponses;
    });
  };

  // Fonction pour soumettre les réponses (la note est calculée côté serveur)
  const handleExerciseSubmission = async (): Promise<void> => {
    const result = await addExerciceResponse({
      exerciceId: exerciceId.toString(),
      response: selectedAnswers,
    });

    if (result?.data) {
      setNote({
        note: result.data.note,
        coeficient: result.data.coeficient,
      });
    }
  };

  return {
    selectedAnswers,
    note,
    isPending,
    isSuccess,
    data,
    updateAnswerSelection,
    handleExerciseSubmission,
    resetExercise,
  };
};
