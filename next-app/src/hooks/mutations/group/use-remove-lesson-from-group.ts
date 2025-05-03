import { removeLessonFromGroupAction } from "@/actions/group.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveLessonFromGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupId,
      lessonId,
    }: {
      groupId: string;
      lessonId: string;
    }) => {
      const response = await removeLessonFromGroupAction(groupId, lessonId);
      // Si la réponse contient une erreur, on la rejette
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["group", data.data.id] });
        return data;
      }
    },
  });
};
