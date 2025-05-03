import { addExerciceResultAction } from "@/actions/exercice.action";
import { globalExerciceCorectionType } from "@/shema-zod/exercice-corection.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddExerciceResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: globalExerciceCorectionType) =>
      addExerciceResultAction(data),
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) {
        // Invalider les requêtes pertinentes si nécessaire
        queryClient.invalidateQueries({
          queryKey: ["studentExercices"],
        });
        toast.success(data.success);
      }
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout de la réponse d'exercice :", error);
      toast.error(
        "Une erreur est survenue lors de l'ajout de la réponse d'exercice"
      );
    },
  });
};
