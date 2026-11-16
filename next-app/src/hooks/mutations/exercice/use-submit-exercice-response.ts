import type { addExerciceResultAction } from "@/actions/exercice.action";
import { submitPracticeAttemptAction } from "@/actions/exercice-practice.action";
import { usePracticeMode } from "@/hooks/practice-mode-context";
import { globalExerciceCorectionType } from "@/shema-zod/exercice-corection.shema";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAddExerciceResponse } from "./use-add-exercice-response";

type SubmitResult =
  | Awaited<ReturnType<typeof addExerciceResultAction>>
  | Awaited<ReturnType<typeof submitPracticeAttemptAction>>;

/**
 * Envoi de la réponse d'un exercice.
 * - Mode noté (par défaut) : la copie est enregistrée, puis l'élève est
 *   redirigé vers sa correction.
 * - Mode entraînement : l'essai est enregistré sans note officielle et seule
 *   la note est transmise au mode entraînement (`data` vaut null, pas de
 *   redirection, pas de correction).
 */
export const useSubmitExerciceResponse = (): UseMutationResult<
  SubmitResult,
  Error,
  globalExerciceCorectionType
> => {
  const practiceMode = usePracticeMode();
  const graded = useAddExerciceResponse();
  const practice = useMutation({
    mutationFn: (data: globalExerciceCorectionType) => submitPracticeAttemptAction(data),
    onSuccess: (result) => {
      if (result.error) toast.error(result.error);
      if ("practice" in result && result.practice) {
        practiceMode?.onResult(result.practice);
      }
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi de l'essai d'entraînement :", error);
      toast.error("Une erreur est survenue lors de l'envoi de ton essai");
    },
  });

  return (practiceMode ? practice : graded) as UseMutationResult<
    SubmitResult,
    Error,
    globalExerciceCorectionType
  >;
};
