import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import React from "react";
import { isInputPosition } from "../../../(lib)/utils";
import { NoteDisplay } from "@/components/note-display";

interface ExerciseResultTextProps {
  originalText: string[];
  response: { [key: number]: string };
  answers: contentGapFillInput["answers"];
  note: number;
  coeficient: number;
}

export const ExerciseResultText: React.FC<ExerciseResultTextProps> = ({
  originalText,
  response,
  answers,
  note,
  coeficient,
}) => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Correction</h2>
        <NoteDisplay note={note} coeficient={coeficient} />
      </div>
      {/* Texte original */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Réponse</h3>
        <div className="flex gap-[0.15rem] flex-wrap text-muted-foreground">
          {originalText.map((word, index) => {
            if (isInputPosition(index, answers)) {
              return (
                <span key={index} className="font-bold">
                  {`[ ${word} ]`}
                </span>
              );
            }
            return <span key={index}>{word}</span>;
          })}
        </div>
      </div>
      {/* Texte modifié */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Texte modifié</h3>
        <div className="flex gap-[0.15rem] flex-wrap">
          {originalText.map((word, index) => {
            if (isInputPosition(index, answers)) {
              const correctAnswer = answers.find((a) => a.position === index);
              const userAnswer = response[index];
              const isCorrect = userAnswer === correctAnswer?.answer;

              return (
                <span
                  key={index}
                  className={`font-semibold ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userAnswer || (
                    <span className="text-red-600 italic">
                      {correctAnswer?.placeholder}
                    </span>
                  )}
                </span>
              );
            } else {
              return <span key={index}>{word}</span>;
            }
          })}
        </div>
      </div>
    </div>
  );
};
