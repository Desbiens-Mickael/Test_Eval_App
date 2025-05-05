"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AnswerList from "./answer-list";
import AnswerSelector from "./answerSelector";
import ShowContentGapFillPreview from "./show-content-gap-fill-preview";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";
import TextEditorWithAlert from "./textEditorWithAlert";

export interface AnswerInput {
  answer: string;
  placeholder: string;
  position: number;
}

export interface contentGapFillInput {
  text: string[];
  answers: AnswerInput[];
}

interface ContentFillGapTextFormProps {
  initialValue?: contentGapFillInput;
  onChange?: (newValue: contentGapFillInput) => void;
  isEditing?: boolean;
}

export default function ContentFillGapTextForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentFillGapTextFormProps) {
  const { content, setInitialValues } = useContentGapFillTextStore();
  const [toggleMode, setToggleMode] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie si initialValue est défini et valide
    const defaultValue = initialValue || { text: [], answers: [] };

    // Initialise uniquement si le contenu n'est pas déjà configuré
    setInitialValues(defaultValue, onChange);

    return () => {
      setInitialValues({ text: [], answers: [] }); // Vide les valeurs
    };
  }, [initialValue, onChange, setInitialValues]);

  useEffect(() => {
    if (initialValue?.text?.length) {
      setToggleMode(true);
    }
  }, [initialValue?.text?.length]);

  // Fonction pour générer le placeholder
  const replaceAllTextWithPlaceholder = useCallback(() => {
    if (!content?.text || content.text.length === 0) return ""; // Protection contre undefined
    const updatedText = [...content.text]; // Copie sécurisée
    for (let i = 0; i < content.answers?.length; i++) {
      if (updatedText[content.answers[i].position] !== undefined) {
        updatedText[content.answers[i].position] =
          content.answers[i].placeholder;
      }
    }
    return updatedText.join(""); // Retourne le texte modifié
  }, [content]);

  const handleToggleMode = () => {
    if (content.text?.length === 0 || content.text === undefined) {
      toast.error("Veuillez entrer un texte.");
      return;
    }
    setToggleMode(!toggleMode);
  };

  return (
    <>
      {isEditing ? (
        <div className="flex flex-col gap-4 border border-dashed border-primary-200 p-4 rounded-lg">
          <div className="flex flex-col gap-1">
            {!toggleMode ? (
              <TextEditorWithAlert handleToggleMode={handleToggleMode} />
            ) : (
              <AnswerSelector
                handleToggleMode={handleToggleMode}
                modifiedText={replaceAllTextWithPlaceholder()}
              />
            )}
          </div>
          {content.answers?.length > 0 && <AnswerList />}
        </div>
      ) : (
        <ShowContentGapFillPreview
          modifiedText={replaceAllTextWithPlaceholder()}
        />
      )}
    </>
  );
}
