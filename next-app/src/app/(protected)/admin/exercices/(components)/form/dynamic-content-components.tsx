import {
  columnInput,
  contentInput,
  trueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Types des composants disponibles
export type ComponentType = "Carte" | "Vrai ou Faux";

// Typage spécifique pour chaque type de composant
type ComponentProps = {
  Carte: columnInput[];
  "Vrai ou Faux": trueOrFalseInput[];
};

// Chargement dynamique des composants
const ContentCardForm = dynamic(
  () => import("./exerciceType/content-card/content-card-form"),
  { ssr: false }
);

const TrueFalseForm = dynamic(
  () => import("./exerciceType/true-or-false/content-true-or-false-form"),
  { ssr: false }
);

// Mapping des composants
const componentMap = {
  Carte: ContentCardForm,
  "Vrai ou Faux": TrueFalseForm,
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
        <div className="w-fit h-fit p-4 text-xl text-slate-800">
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
