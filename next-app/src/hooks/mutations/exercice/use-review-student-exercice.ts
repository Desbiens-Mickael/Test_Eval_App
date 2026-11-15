import { reviewStudentExerciceAction } from "@/actions/exercice-review.action";
import { ExerciceReviewInput } from "@/shema-zod/exercice-review.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Enregistre la note ajustée et le commentaire du professeur sur une copie */
export const useReviewStudentExercice = (studentExerciceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExerciceReviewInput) =>
      reviewStudentExerciceAction(studentExerciceId, data),
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
