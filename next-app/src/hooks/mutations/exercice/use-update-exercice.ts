import { updateExerciceAction } from "@/actions/exercice.action";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateExercice = (type: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      exerciceId,
      data,
    }: {
      data: createExerciceFormInput;
      exerciceId: string;
    }) => updateExerciceAction(exerciceId, data),
    onSuccess: (data) => {
      if (data?.error) return data.error;
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: ["exercice", data.data.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["allExercicesByType", type],
        });
        return data.success;
      }
    },
  });
};
