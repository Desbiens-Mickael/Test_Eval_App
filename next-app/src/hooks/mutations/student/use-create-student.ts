import { createNewStudentAction } from "@/actions/register.action";
import { registerStudentFormType } from "@/shema-zod/auth.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: registerStudentFormType) => createNewStudentAction(data),
    onSuccess: (data) => {
      if (data?.error) return data.error;
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: ["AllStudents"],
        });
        return data.success;
      }
    },
  });
};
