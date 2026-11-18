import { getStudentByIdAction } from "@/actions/student.action";
import { UserRole } from "@prisma/client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface StudentResponse {
  name: string;
  id: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  identifier: string;
  isActive: boolean;
  disabledAt: Date | null;
  /** E-mail du parent (facultatif) : renseigné, l'espace parent existe */
  parentEmail: string | null;
  professorId: string;
  groupStudent: {
    name: string;
    id: string;
  } | null;
}

export const useGetStudentById = ({
  studentId,
}: {
  studentId: string;
}): UseQueryResult<StudentResponse | null | undefined, Error> => {
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
