import updateUserInfos from "@/actions/uptdate-user-infos";
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
    mutationFn: updateUserInfos,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        update({});
      }
      if (data.error) toast.error(data.error);
      queryClient.invalidateQueries({ queryKey: ["userByEmail"] });
    },
  });
};