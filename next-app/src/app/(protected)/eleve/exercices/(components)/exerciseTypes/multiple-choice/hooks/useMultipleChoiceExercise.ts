import { MultipleChoiceExerciseProps } from "@/app/(protected)/eleve/exercices/(components)/exerciseTypes/multiple-choice/types";
import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { calculateNote } from "@/lib/utils";
import {
  multipleChoiceResponseItemType,
  multipleChoiceResponseType,
} from "@/shema-zod/exercice-corection.shema";
import { noteExerciceStudent } from "@/type/exercice";
import { useState } from "react";

export const useMultipleChoiceExercise = ({
  exerciceId,
  content,
  level,
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

  // Fonction pour obtenir les indices des réponses correctes pour une question
  const getCorrectAnswersForQuestion = (questionIndex: number): number[] => {
    const question = content[questionIndex];
    const correctIndices = question.answers
      .map((answer, index) => (answer.isCorrect ? index : -1))
      .filter((index) => index !== -1);
    return correctIndices;
  };

  // Fonction pour évaluer les réponses de l'étudiant
  const evaluateStudentAnswer = (answer: multipleChoiceResponseItemType) => {
    const selectedAnswersSet = answer.selectedAnswers;
    const correctAnswersSet = getCorrectAnswersForQuestion(
      answer.questionIndex
    );

    const isCorrect =
      selectedAnswersSet.length === correctAnswersSet.length &&
      selectedAnswersSet.every((index) => correctAnswersSet.includes(index));

    return {
      isCorrect,
      selectedAnswers: selectedAnswersSet,
      correctAnswers: correctAnswersSet,
    };
  };

  // Fonction pour calculer le score total
  const calculateTotalScore = (answers: multipleChoiceResponseType): number => {
    return answers.reduce((total, answer) => {
      const { isCorrect } = evaluateStudentAnswer(answer);
      return isCorrect ? total + 1 : total;
    }, 0);
  };

  // Fonction pour soumettre les réponses
  const handleExerciseSubmission = async (): Promise<void> => {
    const studentAnswers = selectedAnswers;
    const correctAnswersCount = calculateTotalScore(studentAnswers);
    const maxPossibleScore = content.length;

    // Calcul de la note
    const exerciseNote = calculateNote({
      level,
      maxCorrectAnswers: maxPossibleScore,
      correctAnswers: correctAnswersCount,
    });

    setNote(exerciseNote);

    // Ajout de la réponse de l'étudiant dans la base de données
    await addExerciceResponse({
      exerciceId: exerciceId.toString(),
      ...exerciseNote,
      response: studentAnswers,
    });
  };

  return {
    selectedAnswers,
    note,
    isPending,
    isSuccess,
    data,
    updateAnswerSelection,
    handleExerciseSubmission,
  };
};
