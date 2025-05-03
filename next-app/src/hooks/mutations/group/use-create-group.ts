import { createGroupAction } from "@/actions/group.action";
import { CreateGroupInput } from "@/shema-zod/group.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: CreateGroupInput) => {
      const response = await createGroupAction(name);
      // Si la réponse contient une erreur, on la rejette
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["allGroups"] });
      }
      return data;
    },
  });
};
