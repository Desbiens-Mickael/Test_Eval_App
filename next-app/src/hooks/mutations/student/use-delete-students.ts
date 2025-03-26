import { deleteStudentsAction } from "@/actions/student.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentIds: string[]) => deleteStudentsAction(studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AllStudents"],
      });
    },
  });
};
