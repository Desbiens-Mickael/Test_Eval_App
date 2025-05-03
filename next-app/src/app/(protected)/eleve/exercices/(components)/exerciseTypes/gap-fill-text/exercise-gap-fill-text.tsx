"use client";

import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { calculateNote, shuffleArray } from "@/lib/utils";
import { gapFillTextResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { RefreshCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { isInputPosition } from "../../../(lib)/utils";
import { ExerciseResultText } from "./exercise-result-text";

interface ExerciseGapFillTextProps {
  exerciceId: string;
  content: contentGapFillInput;
  level: string;
}

export default function ExerciseGapFillText({
  exerciceId,
  content,
  level,
}: ExerciseGapFillTextProps) {
  const [inputs, setInputs] = useState<gapFillTextResponseType>({});
  const [isValidated, setIsValidated] = useState(false);
  const [note, setNote] = useState<{ note: number; coeficient: number }>({
    note: 0,
    coeficient: 0,
  });

  const { mutateAsync: addExerciceResponse, isPending } =
    useAddExerciceResponse();

  const handleInputChange = useCallback(
    (pos: number, value: string) => {
      setInputs((prev) => ({ ...prev, [pos]: value.trim() }));
    },
    [setInputs]
  );

  const shuffledAnswers = useMemo(() => {
    return shuffleArray(content.answers).map((a) => a.answer);
  }, [content.answers, shuffleArray]);

  const handleReset = useCallback(() => {
    setInputs({});
    setIsValidated(false);
  }, [setInputs]);

  const handleSubmit = useCallback(async () => {
    try {
      const maxCorrectAnswers = content.answers.length;
      const correctAnswers = content.answers.filter(
        (a) => a.answer === inputs[a.position]
      ).length;
      const note: { note: number; coeficient: number } = calculateNote(
        level,
        maxCorrectAnswers,
        correctAnswers
      );
      setNote(note);
      const result = await addExerciceResponse({
        exerciceId,
        note: note.note,
        coeficient: note.coeficient,
        response: inputs,
      });
      if (result.success) {
        setIsValidated(true);
      }
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la validation de l'exercice"
      );
      console.error("Error checking answers:", error);
    }
  }, [addExerciceResponse, exerciceId, inputs, level, setNote]);

  return (
    <div className="relative flex flex-col gap-10">
      {level !== "Très difficile" && (
        <div className="text-sm text-muted-foreground">
          {shuffledAnswers.join(" | ")}
        </div>
      )}
      {!isValidated ? (
        <>
          <div className="flex gap-[0.15rem] flex-wrap ">
            {content.text.map((word, index) => {
              if (isInputPosition(index, content.answers)) {
                const width = content.answers.find((a) => a.position === index)
                  ?.answer.length;
                return (
                  <input
                    key={index}
                    type="text"
                    value={inputs[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ width: `${(width || 2) + 1}ch` }}
                    className="border-b border-b-foreground px-1 text-foreground font-semibold"
                  />
                );
              } else {
                return <span key={index}>{word}</span>;
              }
            })}
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
        <ExerciseResultText
          originalText={content.text}
          response={inputs}
          answers={content.answers}
          note={note.note}
          coeficient={note.coeficient}
        />
      )}
    </div>
  );
}
