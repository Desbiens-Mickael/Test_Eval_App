import { trueOrFalseResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentTrueOrFalseInput } from "@/shema-zod/exercice.shema";

interface ExerciceResultTrueOrFalseProps {
  content: contentTrueOrFalseInput;
  response: trueOrFalseResponseType;
}

export const ExerciceResultTrueOrFalse = ({
  content,
  response,
}: ExerciceResultTrueOrFalseProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
      <div className="space-y-6">
        {content.map((question, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-3">
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">
                {question.question}
              </p>
              {response[index]?.answer === question.answer ? (
                <span className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">
                  Correct
                </span>
              ) : (
                <span className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400">
                  Incorrect
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
              <div
                className={`
                  flex justify-center items-center gap-2 px-4 py-2 rounded-lg
                  ${
                    response[index]?.answer === true
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }
                `}
              >
                <span className="text-xs sm:text-sm md:text-base font-semibold">
                  Vrai
                </span>
              </div>

              <div
                className={`
                  flex justify-center items-center gap-2 px-4 py-2 rounded-lg
                  ${
                    response[index]?.answer === false
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }
                `}
              >
                <span className="text-xs sm:text-sm md:text-base font-semibold">
                  Faux
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
