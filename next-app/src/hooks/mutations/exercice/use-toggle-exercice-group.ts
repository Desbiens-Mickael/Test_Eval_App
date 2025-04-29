import { toggleExerciceGroupAction } from "@/actions/exercice.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useToggleExerciceGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      exerciceId,
      groupId,
    }: {
      exerciceId: string;
      groupId: string;
    }) => toggleExerciceGroupAction(exerciceId, groupId),
    onSuccess: (data) => {
      const lessonId = data.data?.lesson.id;
      if (data?.error) toast.error(data.error);
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: ["allExercicesByLessonId", lessonId],
        });
        toast.success(data.success);
      }
    },
  });
};
