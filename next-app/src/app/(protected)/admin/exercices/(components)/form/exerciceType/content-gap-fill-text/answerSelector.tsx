"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

interface AnswerSelectorProps {
  modifiedText: string;
  handleToggleMode: () => void;
}

export default function AnswerSelector({
  modifiedText,
  handleToggleMode,
}: AnswerSelectorProps) {
  const [inputAnswer, setInputAnswer] = useState<string>("");
  const { content, addAnswer } = useContentGapFillTextStore();

  // Fonction pour générer le placeholder
  const generatePlaceholder = useCallback(
    (answer: string, selectedText: string) => {
      // Trouver la position de selectedText dans answer
      const startIndex = answer.indexOf(selectedText);

      if (startIndex === -1) {
        // Si selectedText n'est pas trouvé, retourner l'answer tel quel
        return answer;
      }

      // Générer le placeholder pour la sélection
      const placeholder =
        answer.substring(0, startIndex) + // Partie avant la sélection
        "_".repeat(selectedText.length) + // Remplacer la sélection
        answer.substring(startIndex + selectedText.length); // Partie après la sélection

      return placeholder;
    },
    []
  );

  // Fonction de gestion de la sélection
  const handleSelection = useCallback(() => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      setInputAnswer(selectedText);
    } else {
      setInputAnswer("");
    }
  }, []);

  // Fonction de gestion de l'ajout de la réponse
  const handleAnswerAdd = useCallback(() => {
    const inputAnswerTrimmed = inputAnswer.trim();
    if (!inputAnswerTrimmed) {
      toast.error("La réponse ne peut pas être vide.");
      return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!selection || !range) {
      toast.error("Sélection invalide.");
      return;
    }

    const selectedText = selection.toString().trim(); // Texte sélectionné

    // Calculer l'index en utilisant uniquement les mots
    let currentIndex = 0;
    let foundIndex = -1;

    for (let i = 0; i < content.text.length; i++) {
      const word = content.text[i];

      // Vérifier si la sélection correspond au mot ou partie d'un mot
      if (
        word.includes(selectedText) && // Correspondance trouvée dans ce mot
        range.startOffset >= currentIndex && // Commence à l'intérieur de ce mot
        range.startOffset <= currentIndex + word.length // Se termine dans ce mot
      ) {
        foundIndex = i;
        break;
      }

      // Avancer l'index (en tenant compte des espaces)
      currentIndex += word.length;
    }

    if (foundIndex === -1) {
      toast.error("Mot non trouvé dans le texte.");
      return;
    }

    const wordToReplace = content.text[foundIndex]; // Mot complet sélectionné

    // Vérifier si le mot est déjà ajouté
    if (content.answers?.some((answer) => answer.position === foundIndex)) {
      toast.error("Ce mot a déjà été ajouté comme réponse.");
      return;
    }

    // Générer un placeholder pour tout le mot sélectionné
    const placeholder = generatePlaceholder(wordToReplace, selectedText);

    // Ajouter la réponse
    addAnswer({ answer: wordToReplace, placeholder, position: foundIndex });
    setInputAnswer("");
  }, [content, inputAnswer, generatePlaceholder, addAnswer]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        className="w-fit ms-auto"
        onClick={() => handleToggleMode()}
      >
        Modifier le texte
      </Button>
      <div className="flex flex-col justify-between min-h-[200px] w-full p-4 border rounded-md">
        <p onMouseUp={handleSelection} className="whitespace-pre-wrap">
          {modifiedText}
        </p>
        {inputAnswer && (
          <div className="w-fit flex items-center gap-2 bg-background-200 rounded-lg p-2 shadow-md mx-auto">
            <span className="font-semibold">{inputAnswer}</span>
            <Button size={"sm"} type="button" onClick={handleAnswerAdd}>
              Remplacer
            </Button>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="p-2"
              type="button"
              onClick={() => setInputAnswer("")}
            >
              <X size={24} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
