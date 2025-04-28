import { addLessonsToGroupAction } from "@/actions/group.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddLessonsToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupId,
      lessonIds,
    }: {
      groupId: string;
      lessonIds: string[];
    }) => {
      const response = await addLessonsToGroupAction(groupId, lessonIds);
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        const groupId = data.data.id;
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        queryClient.invalidateQueries({
          queryKey: ["allLessonsByGroupId", groupId],
        });
        queryClient.invalidateQueries({
          queryKey: ["allLessonsNotInGroup", groupId],
        });
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      }
      return data;
    },
  });
};
