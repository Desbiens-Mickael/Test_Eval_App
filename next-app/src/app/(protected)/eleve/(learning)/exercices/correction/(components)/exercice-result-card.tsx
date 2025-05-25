import { cardResponseItemType } from "@/shema-zod/exercice-corection.shema";
import { contentCardInput } from "@/shema-zod/exercice.shema";
import { Check, X } from "lucide-react";

interface ExerciceResultCardProps {
  content: contentCardInput; // La solution correcte
  response: cardResponseItemType[]; // La réponse de l'utilisateur
}

export default function ExerciceResultCard({
  content,
  response,
}: ExerciceResultCardProps) {
  return (
    <div className="md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {response.map((col) => {
          const userColumn = content.find((r) => r.column === col.column);

          return (
            <div
              key={col.column}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h3 className="font-semibold text-blue-900">{col.column}</h3>
              </div>
              <div className="p-4 space-y-3">
                {col.cards.map((card) => {
                  // Trouver la colonne correcte pour cette carte
                  const correctColumn = content.find((contentCol) =>
                    contentCol.cards.some(
                      (contentCard) => contentCard.id === card.id
                    )
                  );
                  const isCorrect = correctColumn?.column === col.column;

                  return (
                    <div
                      key={card.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          isCorrect ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {isCorrect ? (
                          <Check
                            className="w-4 h-4 text-green-600"
                            strokeWidth={3}
                          />
                        ) : (
                          <X className="w-4 h-4 text-red-600" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-grow flex justify-between items-center">
                        <span
                          className={`flex-grow ${
                            isCorrect ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {card.content}
                        </span>
                        {!isCorrect && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                            <span className="text-red-600 font-medium px-2 py-1 rounded-md border shadow-sm shadow-red-200">
                              {correctColumn?.column}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
