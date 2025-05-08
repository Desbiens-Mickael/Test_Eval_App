import { getStudentExerciceByIdAction } from "@/actions/exercice.action";
import { StudentExerciceById } from "@/type/exercice";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetStudentExerciceById = ({
  studentExerciceId,
}: {
  studentExerciceId: string;
}): UseQueryResult<StudentExerciceById | null, Error> => {
  return useQuery({
    queryKey: ["student-exercice", studentExerciceId],
    queryFn: async () => {
      const response = await getStudentExerciceByIdAction(studentExerciceId);
      if (response.error) {
        toast.error(response.error);
      }
      return response.data;
    },
    retry: false,
  });
};
