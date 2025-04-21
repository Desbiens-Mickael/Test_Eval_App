import { updateUserInfosAction } from "@/actions/user-info.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/**
 * Hook for updating user infos.
 * @returns {Promise} a promise resolving to the updated user infos
 */
export const useUpdateUserInfos = () => {
  const { update } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserInfosAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        update({});
        queryClient.invalidateQueries({ queryKey: ["userByEmail"] });
      }
      if (data.error) toast.error(data.error);
    },
  });
};
