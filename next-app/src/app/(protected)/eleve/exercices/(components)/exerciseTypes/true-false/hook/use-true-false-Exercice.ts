import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { calculateNote } from "@/lib/utils";
import { trueOrFalseResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentTrueOrFalseInput } from "@/shema-zod/exercice.shema";
import { noteExerciceStudent } from "@/type/exercice";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Hook personnalisé pour gérer les réponses
const useTrueFalseExercice = (
  content: contentTrueOrFalseInput,
  level: string
) => {
  const [response, setResponse] = useState<trueOrFalseResponseType>(
    content.map((_, index) => ({ answer: null, index }))
  );
  const [note, setNote] = useState<noteExerciceStudent>({
    note: 0,
    coeficient: 0,
  });
  const [isFullFilled, setIsFullFilled] = useState(true);

  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
  } = useAddExerciceResponse();

  const validateResponses = useCallback(() => {
    const allQuestionsAnswered = response.every((r) => r.answer !== null);

    if (!allQuestionsAnswered) {
      const unansweredIndices = response
        .map((r, index) => (r.answer === null ? index : -1))
        .filter((index) => index !== -1);

      toast.error("Veuillez répondre à toutes les questions", {
        description: `Questions sans réponse : ${unansweredIndices
          .map((i) => i + 1)
          .join(", ")}`,
      });

      setIsFullFilled(false);
      return false;
    }

    return true;
  }, [response]);

  const submitResponses = useCallback(
    async (exerciceId: string) => {
      if (!validateResponses()) return;

      try {
        const maxCorrectAnswers = content.length;
        const correctAnswers = response.filter(
          (a) => a.answer === content[a.index].answer
        ).length;

        const { note, coeficient } = calculateNote({
          level,
          maxCorrectAnswers,
          correctAnswers,
        });

        setNote({ note, coeficient });
        await addExerciceResponse({
          exerciceId,
          note,
          coeficient,
          response,
        });
        setIsFullFilled(true);
      } catch (error) {
        toast.error(
          "Une erreur est survenue lors de la validation de l'exercice"
        );
        console.error("Error checking answers:", error);
      }
    },
    [addExerciceResponse, response, level, content, validateResponses]
  );

  const updateResponse = useCallback((index: number, answer: boolean) => {
    setResponse((prev) => {
      const newResponse = [...prev];
      newResponse[index] = { answer, index };
      return newResponse;
    });
  }, []);

  const resetResponses = useCallback(() => {
    setResponse(content.map((_, index) => ({ answer: null, index })));
  }, [content]);

  return {
    response,
    note,
    isFullFilled,
    isPending,
    isSuccess,
    updateResponse,
    submitResponses,
    resetResponses,
  };
};

export default useTrueFalseExercice;
