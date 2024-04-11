import updateUserSecurity from "@/actions/update-user-security";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateUserSecurity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserSecurity,
    onSuccess: (data) => {
      if (data.error) toast.error(data.error);
      if (data.success) toast.error(data.success);
      queryClient.invalidateQueries({ queryKey: ["userByEmail"] });
    },
  });
};
