import { getStudentByIdAction } from "@/actions/student.action";
import { StudentInfosTeacher } from "@/type/student";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface StudentById {
  studentId: string;
}

export const useGetStudentById = ({
  studentId,
}: StudentById): UseQueryResult<StudentInfosTeacher | null, Error> => {
  return useQuery({
    queryKey: ["studentById", studentId],
    queryFn: async ({ queryKey }) => {
      const [, studentId] = queryKey;
      if (typeof studentId === "string") {
        const response = await getStudentByIdAction(studentId);
        if (response.error) {
          toast.error(response.error);
        }
        return response.data;
      }
    },
    retry: false,
    enabled: !!studentId,
  });
};
