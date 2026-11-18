"use client";

import {
  cardResponseItemType,
  gapFillTextResponseType,
  matchingPairsResponseType,
  multipleChoiceResponseType,
  orderingResponseType,
  trueOrFalseResponseType,
} from "@/shema-zod/exercice-corection.shema";
import {
  contentCardInput,
  contentGapFillInput,
  contentMatchingPairsInput,
  contentMultipleChoiceInput,
  contentOrderingInput,
  contentTrueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import { JsonValue } from "@prisma/client/runtime/library";
import ExerciceResultCard from "./exercice-result-card";
import ExerciceResultMatchingPairs from "./exercice-result-matching-pairs";
import ExerciceResultMultipleChoice from "./exercice-result-multiple-choice";
import ExerciceResultOrdering from "./exercice-result-ordering";
import ExerciceResultTrueOrFalse from "./exercice-result-true-or-false";
import ExerciseResultGapFillText from "./exercise-result-gap-fill-text";

interface CorrectionByTypeProps {
  type: string;
  /** Contenu de l'exercice, avec les solutions */
  content: JsonValue;
  response: unknown;
}

/** Correction d'une réponse selon le type d'exercice */
export default function CorrectionByType({ type, content, response }: CorrectionByTypeProps) {
  switch (type) {
    case "Texte à trou":
      return (
        <ExerciseResultGapFillText
          content={content as contentGapFillInput}
          response={response as gapFillTextResponseType}
        />
      );
    case "Carte":
      return (
        <ExerciceResultCard
          content={content as contentCardInput}
          response={response as cardResponseItemType[]}
        />
      );
    case "Vrai ou Faux":
      return (
        <ExerciceResultTrueOrFalse
          content={content as contentTrueOrFalseInput}
          response={response as trueOrFalseResponseType}
        />
      );
    case "Choix multiple":
      return (
        <ExerciceResultMultipleChoice
          content={content as contentMultipleChoiceInput}
          response={response as multipleChoiceResponseType}
        />
      );
    case "Associer par paires":
      return (
        <ExerciceResultMatchingPairs
          content={content as contentMatchingPairsInput}
          response={response as matchingPairsResponseType}
        />
      );
    case "Remettre dans l'ordre":
      return (
        <ExerciceResultOrdering
          content={content as contentOrderingInput}
          response={response as orderingResponseType}
        />
      );
    default:
      return null;
  }
}
