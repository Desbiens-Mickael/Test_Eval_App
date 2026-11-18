import { reviewFreeResponseAction } from "@/actions/exercice-review.action";
import { FreeResponseReviewInput } from "@/shema-zod/exercice-review.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Enregistre la correction question par question d'une copie « Réponse libre » */
export const useReviewFreeResponse = (studentExerciceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FreeResponseReviewInput) =>
      reviewFreeResponseAction(studentExerciceId, data),
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({
          queryKey: ["student-exercice", studentExerciceId],
        });
        queryClient.invalidateQueries({ queryKey: ["studentExercices"] });
      }
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'enregistrement de la correction.");
    },
  });
};
