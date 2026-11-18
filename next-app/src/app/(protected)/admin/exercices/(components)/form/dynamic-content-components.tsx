import {
  columnInput,
  contentGapFillInput,
  contentInput,
  matchingPairInput,
  multipleChoiceInput,
  orderingSequenceInput,
  trueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Types des composants disponibles
export type ComponentType =
  | "Carte"
  | "Vrai ou Faux"
  | "Choix multiple"
  | "Texte à trou"
  | "Associer par paires"
  | "Remettre dans l'ordre";

// Typage spécifique pour chaque type de composant
type ComponentProps = {
  Carte: columnInput[];
  "Vrai ou Faux": trueOrFalseInput[];
  "Choix multiple": multipleChoiceInput[];
  "Texte à trou": contentGapFillInput;
  "Associer par paires": matchingPairInput[];
  "Remettre dans l'ordre": orderingSequenceInput[];
};

// Chargement dynamique des composants
const ContentCardForm = dynamic(
  () => import("./exerciceType/content-card/content-card-form"),
  { ssr: false }
);

const TrueFalseForm = dynamic(
  () =>
    import("./exerciceType/content-true-or-false/content-true-or-false-form"),
  { ssr: false }
);

const MultipleChoiceForm = dynamic(
  () =>
    import(
      "./exerciceType/content-multiple-choice/content-multiple-choice-form"
    ),
  { ssr: false }
);

const GapFillTextForm = dynamic(
  () =>
    import("./exerciceType/content-gap-fill-text/content-gap-fill-text-form"),
  { ssr: false }
);

const MatchingPairsForm = dynamic(
  () => import("./exerciceType/content-matching-pairs/content-matching-pairs-form"),
  { ssr: false }
);

const OrderingForm = dynamic(
  () => import("./exerciceType/content-ordering/content-ordering-form"),
  { ssr: false }
);

// Mapping des composants
const componentMap = {
  Carte: ContentCardForm,
  "Vrai ou Faux": TrueFalseForm,
  "Choix multiple": MultipleChoiceForm,
  "Texte à trou": GapFillTextForm,
  "Associer par paires": MatchingPairsForm,
  "Remettre dans l'ordre": OrderingForm,
};

// Définition des props pour le composant dynamique
interface DynamicComponentProps<T extends ComponentType> {
  type: T;
  initialValue: contentInput; // Entrée en tant qu'union type
  isEditing?: boolean;
  onChange?: (newContent: ComponentProps[T]) => void;
}

export const DynamicComponent = <T extends ComponentType>({
  type,
  initialValue,
  isEditing,
  onChange,
}: DynamicComponentProps<T>) => {
  const Component = componentMap[type] as React.FC<{
    initialValue: ComponentProps[T];
    isEditing?: boolean;
    onChange?: (newContent: ComponentProps[T]) => void;
  }>;

  if (!Component) {
    return <div>Type de composant inconnu : {type}</div>;
  }

  // Cast dynamique d'initialValue en fonction du type
  const castedInitialValue = initialValue as unknown as ComponentProps[T];

  return (
    <Suspense
      fallback={
        <div className="w-fit h-fit p-4 text-xl text-muted-foreground">
          Chargement...
        </div>
      }
    >
      <Component
        initialValue={castedInitialValue}
        isEditing={isEditing}
        onChange={onChange}
      />
    </Suspense>
  );
};
