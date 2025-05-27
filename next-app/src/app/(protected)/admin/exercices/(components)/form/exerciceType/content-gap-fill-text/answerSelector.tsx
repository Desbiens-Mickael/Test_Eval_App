"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
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
    addAnswer({ answer: selectedText, placeholder, position: foundIndex });

    setInputAnswer("");
  }, [content, inputAnswer, generatePlaceholder, addAnswer]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-fit ml-auto flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleToggleMode}
      >
        <ArrowLeft className="h-4 w-4" />
        Modifier le texte
      </Button>

      <motion.div
        className={cn(
          "flex flex-col min-h-[250px] w-full p-6 rounded-xl",
          "bg-background text-foreground border shadow-sm"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.p
          onMouseUp={handleSelection}
          className={cn(
            "whitespace-pre-wrap text-foreground/90 leading-relaxed",
            "selection:bg-primary/20 selection:text-primary"
          )}
          whileHover={{ cursor: "text" }}
        >
          {modifiedText}
        </motion.p>

        <AnimatePresence>
          {inputAnswer && (
            <motion.div
              className={cn(
                "w-full max-w-md mt-4 mx-auto p-4 rounded-lg",
                "bg-primary/5 border border-primary/20 shadow-sm"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    Sélection :
                  </p>
                  <p className="font-medium text-foreground truncate">
                    {inputAnswer}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleAnswerAdd}
                    className="flex-1 sm:flex-none"
                  >
                    Remplacer
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    type="button"
                    onClick={() => setInputAnswer("")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Annuler</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
