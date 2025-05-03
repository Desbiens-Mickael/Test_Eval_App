"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

interface TextEditorWithAlertProps {
  handleToggleMode: () => void;
}

export default function TextEditorWithAlert({
  handleToggleMode,
}: TextEditorWithAlertProps) {
  const { content, updateText } = useContentGapFillTextStore();

  const handleQuestionChange = useCallback(
    (value: string) => {
      const words =
        value.match(/[\wÀ-ÿ]+(?:['’-][\wÀ-ÿ]*)?|[.,!?;:]|\s+/g) || [];
      updateText(words);
    },
    [updateText]
  );

  return (
    <div className="flex flex-col gap-4">
      {content.answers?.length > 0 && (
        <Alert variant={"warning"}>
          <AlertTitle>Attention !</AlertTitle>
          <AlertDescription>
            Modifier le texte réinitialisera définitivement toutes les réponses,
            y compris celles déjà sauvegardées.
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
        value={content.text && content.text.join("")}
        onChange={(e) => handleQuestionChange(e.target.value)}
      />
      <Button type="button" onClick={() => handleToggleMode()}>
        Valider
      </Button>
    </div>
  );
}
