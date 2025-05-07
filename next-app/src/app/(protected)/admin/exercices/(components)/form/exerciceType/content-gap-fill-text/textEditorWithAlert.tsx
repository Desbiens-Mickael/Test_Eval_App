"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    [handleToggleMode, updateContent]
  );

  return (
    <div className="flex flex-col gap-4">
      {content.answers?.length > 0 && (
        <Alert variant={"warning"}>
          <AlertTitle>Attention !</AlertTitle>
          <AlertDescription>
            Modifier le texte entrainera la suppression de certaines réponses
            qui auront été soit supprimer ou déplacées.
          </AlertDescription>
        </Alert>
      )}
      <Label className="mb-1" htmlFor="baseText">
        Texte
      </Label>
      <Textarea
        id="baseText"
        className="min-h-[200px] w-full resize-none"
        placeholder="Entrer le contenu de l'exercice..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        type="button"
        className="w-fit"
        onClick={() => handleValidateTextChange(inputValue)}
      >
        Valider
      </Button>
    </div>
  );
}
