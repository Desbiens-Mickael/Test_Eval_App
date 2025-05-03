import { updateStudentSecurityAction } from "@/actions/student-security.action";
import { studentSecurityFormType } from "@/shema-zod/auth.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for updating student security.
 * @returns {Promise} a promise resolving to the updated student security
 */
export const useUpdateStudentSecurity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: studentSecurityFormType) =>
      updateStudentSecurityAction(data),
    onSuccess: (data) => {
      if (data.error) toast.error(data.error);
      if (data.success) toast.success(data.success);
      queryClient.invalidateQueries({ queryKey: ["studentByIdentifier"] });
    },
  });
};
