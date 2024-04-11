import updateUserInfos from "@/actions/uptdate-user-infos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
      if (data.error) toast.success(data.error);
      queryClient.invalidateQueries({ queryKey: ["userByEmail"] });
    },
  });
};
