import { NoteDisplay } from "@/components/note-display";
import { useCurrentRole } from "@/hooks/use-current-role";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import React from "react";
import { isInputPosition } from "../../../(lib)/utils";

interface ExerciseResultTextProps {
  content?: contentGapFillInput;
  response: { [key: number]: string };
  note: number;
  coeficient: number;
}

export const ExerciseResultGapFillText: React.FC<ExerciseResultTextProps> = ({
  content,
  response,
  note,
  coeficient,
}) => {
  const userRole = useCurrentRole();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Correction</h2>
        <NoteDisplay note={note} coeficient={coeficient} />
      </div>
      {content && response ? (
        <>
          {/* Texte original */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Réponse</h3>
            <div className="flex gap-[0.15rem] flex-wrap text-muted-foreground">
              {content.text.map((word, index) => {
                if (isInputPosition(index, content.answers)) {
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
              {content.text.map((word, index) => {
                if (isInputPosition(index, content.answers)) {
                  const correctAnswer = content.answers.find(
                    (a) => a.position === index
                  );
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
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-center">
            {userRole === "ADMIN" && (
              <span className="italic text-red-600 font-bold">
                {
                  "Le contenu de cet exercice n’est plus disponible car il a été supprimé. Veuillez en informer l’élève si nécessaire."
                }
              </span>
            )}

            {userRole === "STUDENT" && (
              <span className="italic text-red-600 font-bold">
                {
                  "Oups ! Cet exercice a été supprimé par votre professeur. N’hésitez pas à lui demander plus d’infos 😥"
                }
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
