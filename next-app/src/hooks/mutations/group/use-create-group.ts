import { createGroupAction } from "@/actions/group.action";
import { CreateGroupInput } from "@/shema-zod/group.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: CreateGroupInput) => createGroupAction(name),
    onSuccess: (data) => {
      if (data?.error) return data.error;
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["allGroups"] });
        return data.success;
      }
    },
  });
};
