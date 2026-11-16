"use client";

import {
  contentCardInput,
  contentGapFillInput,
  contentMultipleChoiceInput,
  contentTrueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import { Exercice } from "@/type/exercice";
import ExerciceCard from "./exerciseTypes/card/exercice-card";
import ExerciseGapFillText from "./exerciseTypes/gap-fill-text/exercise-gap-fill-text";
import ExerciceMultipleChoice from "./exerciseTypes/multiple-choice/exercice-multiple-choice";
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
    default:
      return null;
  }
}
