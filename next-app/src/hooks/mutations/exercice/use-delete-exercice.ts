import { deleteExercicesAction } from "@/actions/exercice.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteExercices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciceIds: string[]) => {
      const response = await deleteExercicesAction(exerciceIds);
      // Si la réponse contient une erreur, on la rejette
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success && data.data) {
        // Invalidate queries for each affected subject
        const types = new Set(data.data.map((exercice) => exercice.type.name));
        types.forEach((type) => {
          queryClient.invalidateQueries({
            queryKey: ["allExercicesByType", type],
          });
        });

        // Remove specific lesson queries
        data.data.forEach((exercice) => {
          queryClient.removeQueries({
            queryKey: ["lessonBySlug", exercice.id],
          });
        });
      }
      return data;
    },
  });
};
