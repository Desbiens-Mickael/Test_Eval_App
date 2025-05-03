import { getAllStudentsByAuthorIdAction } from "@/actions/student.action";
import { Student } from "@/type/student";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetAllStudentsByProfessorId = (): UseQueryResult<
  Student[] | [],
  Error
> => {
  return useQuery({
    queryKey: ["AllStudents"],
    queryFn: async () => {
      const response = await getAllStudentsByAuthorIdAction();

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
};
