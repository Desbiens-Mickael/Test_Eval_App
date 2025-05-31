import { getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdAction } from "@/actions/student.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface StudentResponse {
  name: string;
  id: string;
  identifier: string;
  isActive: boolean;
}

export const useGetAllStudentsByAuthorIdwhoDontBelongToTheGroupId = (
  groupId: string
): UseQueryResult<StudentResponse[] | undefined, Error> => {
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
