import { deleteGroupAction } from "@/actions/group.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteGroupAction(id);
      // Si la réponse contient une erreur, on la rejette
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["allGroups"] });
        return data;
      }
    },
  });
};
