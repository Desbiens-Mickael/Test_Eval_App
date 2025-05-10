"use client";

import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { calculateNote } from "@/lib/utils";
import { gapFillTextResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice, noteExerciceStudent } from "@/type/exercice";
import { RefreshCcw } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { isInputPosition } from "../../../(lib)/utils";
import { ExerciseResultGapFillText } from "./exercise-result-gap-fill-text";

interface ExerciseGapFillTextProps extends baseResponseExercice {
  content: contentGapFillInput;
}

export default function ExerciseGapFillText({
  exerciceId,
  content,
  level,
}: ExerciseGapFillTextProps) {
  const [inputs, setInputs] = useState<gapFillTextResponseType>({});
  const [note, setNote] = useState<noteExerciceStudent>({
    note: 0,
    coeficient: 0,
  });

  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
  } = useAddExerciceResponse();

  const handleInputChange = useCallback(
    (pos: number, value: string) => {
      setInputs((prev) => ({ ...prev, [pos]: value.trim() }));
    },
    [setInputs]
  );

  const handleReset = useCallback(() => {
    setInputs({});
  }, [setInputs]);

  const handleSubmit = useCallback(async () => {
    try {
      const maxCorrectAnswers = content.answers.length;
      const correctAnswers = content.answers.filter(
        (a) => a.answer === inputs[a.position]
      ).length;

      const { note, coeficient } = calculateNote(
        level,
        maxCorrectAnswers,
        correctAnswers
      );
      setNote({ note, coeficient });
      const result = await addExerciceResponse({
        exerciceId,
        note,
        coeficient,
        response: inputs,
      });
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la validation de l'exercice"
      );
      console.error("Error checking answers:", error);
    }
  }, [
    addExerciceResponse,
    exerciceId,
    inputs,
    level,
    setNote,
    content.answers,
  ]);
  const replacePlaceholderByInputHTML = () => {
    return content.text.map((word, index) => {
      if (isInputPosition(index, content.answers)) {
        const answer = content.answers.find((a) => a.position === index);

        const match = answer?.placeholder.match(/_+/);

        if (!match) {
          return <span key={index}>{word}</span>;
        }

        const startIndex = match.index ?? 0;
        const width = match[0].length;

        const beforeText = answer?.placeholder.slice(0, startIndex);
        const afterText = answer?.placeholder.slice(startIndex + width);

        return (
          <React.Fragment key={index}>
            <span>{beforeText}</span>
            <input
              type="text"
              value={inputs[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{ width: `${width}ch` }}
              className="border-b border-b-foreground text-foreground font-semibold"
            />
            <span>{afterText}</span>
          </React.Fragment>
        );
      } else {
        return <span key={index}>{word}</span>;
      }
    });
  };

  return (
    <div className="relative flex flex-col gap-10">
      {!isSuccess ? (
        <>
          <div
            className="leading-8"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {replacePlaceholderByInputHTML()}
          </div>
          <div className="flex justify-between items-center">
            <SubmitButton
              onClick={handleSubmit}
              className="w-fit"
              texte="Soumettre"
              isLoading={isPending}
            />
            <Button
              title="Reinitialiser"
              size="icon"
              onClick={handleReset}
              className="bg-background text-primary hover:bg-primary hover:text-background"
              disabled={isPending}
            >
              <RefreshCcw className="h-6 w-6" />
            </Button>
          </div>
        </>
      ) : (
        <ExerciseResultGapFillText
          content={content}
          response={inputs}
          note={note}
        />
      )}
    </div>
  );
}
