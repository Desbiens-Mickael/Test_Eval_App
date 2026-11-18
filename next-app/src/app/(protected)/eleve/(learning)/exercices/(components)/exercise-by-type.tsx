"use client";

import {
  contentCardInput,
  contentGapFillInput,
  contentMultipleChoiceInput,
  contentTrueOrFalseInput,
  studentDictationContent,
  studentFreeResponseContent,
  studentMatchingPairsContent,
  studentOrderingContent,
} from "@/shema-zod/exercice.shema";
import { Exercice } from "@/type/exercice";
import ExerciceCard from "./exerciseTypes/card/exercice-card";
import ExerciceDictation from "./exerciseTypes/dictation/exercice-dictation";
import ExerciceFreeResponse from "./exerciseTypes/free-response/exercice-free-response";
import ExerciseGapFillText from "./exerciseTypes/gap-fill-text/exercise-gap-fill-text";
import ExerciceMatchingPairs from "./exerciseTypes/matching-pairs/exercice-matching-pairs";
import ExerciceMultipleChoice from "./exerciseTypes/multiple-choice/exercice-multiple-choice";
import ExerciceOrdering from "./exerciseTypes/ordering/exercice-ordering";
import ExerciceTrueFalse from "./exerciseTypes/true-false/exercice-true-false";

/** Affiche l'exercice à faire selon son type (noté ou entraînement) */
export default function ExerciseByType({ exercice }: { exercice: Exercice }) {
  switch (exercice.type) {
    case "Carte":
      return (
        <ExerciceCard
          exerciceId={exercice.id}
          content={exercice.content as contentCardInput}
          cards={exercice.cards ?? []}
        />
      );
    case "Vrai ou Faux":
      return (
        <ExerciceTrueFalse
          exerciceId={exercice.id}
          level={exercice.level}
          content={exercice.content as contentTrueOrFalseInput}
        />
      );
    case "Texte à trou":
      return (
        <ExerciseGapFillText
          exerciceId={exercice.id}
          level={exercice.level}
          content={exercice.content as contentGapFillInput}
        />
      );
    case "Choix multiple":
      return (
        <ExerciceMultipleChoice
          exerciceId={exercice.id}
          level={exercice.level}
          content={exercice.content as contentMultipleChoiceInput}
        />
      );
    case "Associer par paires":
      return (
        <ExerciceMatchingPairs
          exerciceId={exercice.id}
          content={exercice.content as studentMatchingPairsContent}
        />
      );
    case "Remettre dans l'ordre":
      return (
        <ExerciceOrdering
          exerciceId={exercice.id}
          content={exercice.content as studentOrderingContent}
        />
      );
    case "Dictée":
      return (
        <ExerciceDictation
          exerciceId={exercice.id}
          content={exercice.content as studentDictationContent}
        />
      );
    case "Réponse libre":
      return (
        <ExerciceFreeResponse
          exerciceId={exercice.id}
          content={exercice.content as studentFreeResponseContent}
        />
      );
    default:
      return null;
  }
}
