import { updateUserSecurityAction } from "@/actions/user-security.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for updating user security.
 * @returns {Promise} a promise resolving to the updated user security
 */
export const useUpdateUserSecurity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserSecurityAction,
    onSuccess: (data) => {
      if (data.error) toast.error(data.error);
      if (data.success) toast.success(data.success);
      queryClient.invalidateQueries({ queryKey: ["userByEmail"] });
    },
  });
};
