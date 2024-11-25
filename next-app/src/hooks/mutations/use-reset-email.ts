import { ResetEmailAction } from "@/actions/reset-email.action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for resetting the user email.
 * @returns {Promise} a promise resolving to the reset email
 */
const useResetEmail = () => {
  return useMutation({
    mutationFn: ResetEmailAction,
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) toast.success(data.success);
    },
  });
};

export default useResetEmail;
