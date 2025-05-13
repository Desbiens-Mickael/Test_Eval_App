import { useCurrentRole } from "@/hooks/use-current-role";
import { gapFillTextResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import React from "react";
import { isInputPosition } from "../../../(lib)/utils";

interface ExerciseResultTextProps {
  content?: contentGapFillInput;
  response: gapFillTextResponseType;
}

export const ExerciseResultGapFillText: React.FC<ExerciseResultTextProps> = ({
  content,
  response,
}) => {
  const userRole = useCurrentRole();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Correction
        </h2>
      </div>

      {content && response ? (
        <div className="space-y-6">
          {/* Texte original */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              Bonne réponse
            </h3>
            <div
              className="leading-relaxed text-gray-600 dark:text-gray-300"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {content.text.map((word, index) => {
                if (isInputPosition(index, content.answers)) {
                  return (
                    <span
                      key={index}
                      className="font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 px-1 rounded"
                    >
                      {`[ ${word} ]`}
                    </span>
                  );
                }
                return <span key={index}>{word}</span>;
              })}
            </div>
          </div>

          <div className="border-t dark:border-gray-700 my-4"></div>

          {/* Texte modifié */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {userRole === "ADMIN" ? "Réponse de l'élève" : "Votre réponse"}
            </h3>
            <div
              className="leading-relaxed"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {content.text.map((word, index) => {
                if (isInputPosition(index, content.answers)) {
                  const correctAnswer = content.answers.find(
                    (a) => a.position === index
                  );
                  let userAnswer = response[index];

                  const isCorrect = userAnswer === correctAnswer?.answer;
                  if (isCorrect) {
                    userAnswer = correctAnswer?.placeholder.replace(
                      /_+/,
                      correctAnswer?.answer
                    );
                  }

                  return (
                    <span
                      key={index}
                      className={`font-semibold px-1 rounded ${
                        isCorrect
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {userAnswer || (
                        <span className="italic">
                          {correctAnswer?.placeholder}
                        </span>
                      )}
                    </span>
                  );
                }
                return <span key={index}>{word}</span>;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {userRole === "ADMIN" ? (
            <p className="text-red-600 dark:text-red-400 font-bold italic">
              {
                "Le contenu de cet exercice n'est plus disponible car il a été supprimé. Veuillez en informer l'élève si nécessaire."
              }
            </p>
          ) : (
            <p className="text-red-600 dark:text-red-400 font-bold italic">
              {
                "Oups ! Cet exercice a été supprimé par votre professeur. N'hésitez pas à lui demander plus d'infos 😥"
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};
