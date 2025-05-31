import { getAllStudentsByAuthorIdAction } from "@/actions/student.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export interface StudentResponse {
  name: string;
  id: string;
  createdAt: Date;
  identifier: string;
  isActive: boolean;
  groupStudent: {
    name: string;
    id: string;
  } | null;
}

export const useGetAllStudentsByProfessorId = (): UseQueryResult<
  StudentResponse[] | undefined,
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
