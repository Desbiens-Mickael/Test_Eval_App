import { updateStudentInfosAction } from "@/actions/student.info.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentInfosFormType } from "@/shema-zod/auth.shema";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useUpdateStudentInfos = () => {
  const { update } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: studentInfosFormType) =>
      updateStudentInfosAction(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        update({});
        queryClient.invalidateQueries({ queryKey: ["studentByIdentifier"] });
      }
      if (data.error) toast.error(data.error);
    },
  });
};
