"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

interface TextEditorWithAlertProps {
  handleToggleMode: () => void;
}

export default function TextEditorWithAlert({
  handleToggleMode,
}: TextEditorWithAlertProps) {
  const { content, updateContent } = useContentGapFillTextStore();
  const [inputValue, setInputValue] = useState<string>(
    content.text ? content.text.join("") : ""
  );

  const handleValidateTextChange = useCallback(
    (value: string) => {
      const words =
        value.match(/[\wÀ-ÿ]+(?:['’-][\wÀ-ÿ]*)?|[.,!?;:]|\s+/g) || [];

      // Validation que le texte contient des mots
      const hasRealWord = words.some(
        (w) => w.trim().length > 0 && !/^[.,!?;:\s]+$/.test(w)
      );
      if (!hasRealWord) {
        toast.error("Veuillez entrer un texte.");
        return;
      }
      // Filtrer les réponses dont la position existe encore dans le texte
      const filteredAnswers = (content.answers || []).filter(
        (answer) => words[answer.position] === answer.answer
      );
      // Mettre à jour texte et réponses
      updateContent(words, filteredAnswers);
      handleToggleMode();
    },
    [handleToggleMode, updateContent, content.answers]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleValidateTextChange(inputValue);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {content.answers?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant={"warning"}>
              <AlertCircle className="h-5 w-5" />
              <div className="ml-3">
                <AlertTitle>Attention !</AlertTitle>
                <AlertDescription>
                  La modification du texte supprimera les réponses correspondant
                  aux mots modifiés ou déplacés.
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="baseText"
            className="text-sm font-medium text-foreground"
          >
            Texte de l'exercice
          </Label>
          <span className="text-xs text-muted-foreground">
            {inputValue.length} caractères
          </span>
        </div>

        <Textarea
          id="baseText"
          className={cn(
            "min-h-[250px] w-full text-base leading-relaxed",
            "focus-visible:ring-2 focus-visible:ring-primary",
            "resize-none transition-all duration-200"
          )}
          placeholder="Écrivez ou collez votre texte ici. Sélectionnez ensuite les mots à masquer..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => handleValidateTextChange(inputValue)}
          className={cn(
            "px-6 py-2 text-base font-medium",
            "bg-primary hover:bg-primary/90 transition-colors",
            "focus-visible:ring-2 focus-visible:ring-primary/50"
          )}
        >
          Valider les modifications
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
