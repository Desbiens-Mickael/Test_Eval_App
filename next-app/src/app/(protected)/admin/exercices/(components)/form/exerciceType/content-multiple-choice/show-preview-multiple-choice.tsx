import { multipleChoiceInput } from "@/shema-zod/exercice.shema";

interface ShowPReviewMUltipleChoiceProps {
  content: multipleChoiceInput[];
}

export default function ShowPReviewMUltipleChoice({
  content,
}: ShowPReviewMUltipleChoiceProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Réponses
      </h3>
      <div className="space-y-6">
        {content.map((question, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-lg font-medium text-gray-700 mb-3">
              {question.question}
            </h4>
            <div className="space-y-3 ms-4">
              {question.answers.map((answer, answerIndex) => (
                <div
                  key={answerIndex}
                  className={`p-3 rounded-md transition-colors duration-200 ${
                    answer.isCorrect
                      ? "bg-green-100 border-l-4 border-green-500"
                      : "bg-red-100 border-l-4 border-red-500"
                  }`}
                >
                  <p className="text-gray-800 font-normal">{answer.answer}</p>
                  <p
                    className={`text-sm font-semibold ${
                      answer.isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {answer.isCorrect
                      ? "Réponse Correcte"
                      : "Réponse Incorrecte"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
