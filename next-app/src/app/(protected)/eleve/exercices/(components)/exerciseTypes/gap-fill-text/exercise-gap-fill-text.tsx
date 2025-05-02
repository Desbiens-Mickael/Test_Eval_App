"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { shuffleArray } from "@/lib/utils";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { RefreshCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { isInputPosition } from "../../../(lib)/utils";
import { ExerciseResultText } from "./exercise-result-text";

interface ExerciseGapFillTextProps {
  content: contentGapFillInput;
  level: string;
}

export default function ExerciseGapFillText({
  content,
  level,
}: ExerciseGapFillTextProps) {
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [note, setNote] = useState<{ note: number; coeficient: number }>({
    note: 0,
    coeficient: 0,
  });

  const handleChange = useCallback(
    (pos: number, value: string) => {
      setInputs((prev) => ({ ...prev, [pos]: value.trim() }));
    },
    [setInputs]
  );

  const shuffledAnswers = useMemo(() => {
    return shuffleArray(content.answers).map((a) => a.answer);
  }, [content.answers, shuffleArray]);

  const handleReset = () => {
    setInputs({});
    setIsValidated(false);
  };

  const calculateNote = (
    level: string,
    maxCorrectAnswers: number,
    correctAnswers: number
  ) => {
    let coeficient: number;
    switch (level) {
      case "Facile":
        coeficient = 5;
        break;
      case "Difficile":
        coeficient = 10;
        break;
      case "Très difficile":
        coeficient = 20;
        break;
      default:
        coeficient = 5; // Coeficient par defaut
    }
    const result = ((correctAnswers / maxCorrectAnswers) * coeficient).toFixed(
      2
    );
    return { note: Number(result), coeficient: coeficient };
  };

  // Valide l'exercice
  const handleCheck = () => {
    setLoading(true);
    try {
      setIsValidated(true);
      const maxCorrectAnswers = content.answers.length;
      const correctAnswers = content.answers.filter(
        (a) => a.answer === inputs[a.position]
      ).length;
      console.log("maxCorrectAnswers", maxCorrectAnswers);
      console.log("correctAnswers", correctAnswers);
      console.log("level", level);
      const note = calculateNote(level, maxCorrectAnswers, correctAnswers);
      console.log("note", note.note);
      console.log("coeficient", note.coeficient);
      setNote(note);
    } catch (error) {
      console.error("Error checking answers:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="relative flex flex-col gap-10">
      {loading ? (
        <Loader />
      ) : (
        <>
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
                    const width = content.answers.find(
                      (a) => a.position === index
                    )?.answer.length;
                    return (
                      <input
                        key={index}
                        type="text"
                        value={inputs[index] || ""}
                        onChange={(e) => handleChange(index, e.target.value)}
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
                <Button
                  onClick={handleCheck}
                  className="w-fit"
                  disabled={loading}
                >
                  Soumettre
                </Button>
                <Button
                  title="Reinitialiser"
                  size="icon"
                  onClick={handleReset}
                  className="bg-background text-primary hover:bg-primary hover:text-background"
                  disabled={loading}
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
        </>
      )}
    </div>
  );
}
