import { createExerciceAction } from "@/actions/exercice.action";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateExercice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      lessonSlug,
    }: {
      data: createExerciceFormInput;
      lessonSlug: string;
    }) => createExerciceAction(data, lessonSlug),
    onSuccess: (data) => {
      if (data?.error) return data.error;
      if (data?.success) {
        // const subject = data.data.LessonSubject.label;
        // queryClient.invalidateQueries({
        //   queryKey: ["allLessonsBySubject", subject],
        // });
        return data.success;
      }
    },
  });
};
