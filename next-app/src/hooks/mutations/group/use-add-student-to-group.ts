import { addStudentToGroupAction } from "@/actions/group.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddStudentToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupId,
      identifier,
    }: {
      groupId: string;
      identifier: string;
    }) => {
      const response = await addStudentToGroupAction(groupId, identifier);
      // Si la réponse contient une erreur, on la rejette
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        const groupId = data.data.id;
        const authorId = data.data.authorId;
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        queryClient.invalidateQueries({
          queryKey: ["TeacherStudentsByGroup", authorId, groupId],
        });
      }
      return data;
    },
  });
};
