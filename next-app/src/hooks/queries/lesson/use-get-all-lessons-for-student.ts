import { getAllLessonsForStudentAction } from "@/actions/lesson.action";
import { Lesson } from "@/type/lesson";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

const useGetAllLessonsForStudent = ({
  subject,
}: {
  subject?: string;
}): UseQueryResult<Lesson[] | [], Error> => {
  return useQuery({
    queryKey: ["allTheStudentLessons", subject],
    queryFn: async () => {
      const response = await getAllLessonsForStudentAction(subject);

      if (response.error) {
        toast.error(response.error);
        return [];
      }

      return response.data;
    },
  });
};

export default useGetAllLessonsForStudent;
