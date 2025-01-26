import { getAllStudentsByAuthorIdAction } from "@/actions/student.action";
import { Student } from "@/type/group";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetAllStudentsByProfessorId = (
  authorId: string,
  groupId: string
): UseQueryResult<Student[] | [], Error> => {
  return useQuery({
    queryKey: ["TeacherStudentsByGroup", authorId, groupId],
    queryFn: async () => {
      const response = await getAllStudentsByAuthorIdAction(authorId, groupId);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
};
