import { getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdAction } from "@/actions/student.action";
import { Student } from "@/type/student";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetAllStudentsByAuthorIdwhoDontBelongToTheGroupId = (
  groupId: string
): UseQueryResult<Student[] | [], Error> => {
  return useQuery({
    queryKey: ["TeacherStudentsByGroup", groupId],
    queryFn: async () => {
      const response =
        await getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdAction(groupId);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
};
