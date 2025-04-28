import { Lesson } from "@/type/lesson";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllLessonsForStudentAction } from "@/actions/lesson.action";

const useGetAllLessonsForStudent = (): UseQueryResult<Lesson[] | [], Error> => {
  return useQuery({
    queryKey: ["allTheStudentLessons"],
    queryFn: async () => {
      const response = await getAllLessonsForStudentAction();

      if (response.error) {
        toast.error(response.error);
        return [];
      }

      return response.data;
    },
  });
};

export default useGetAllLessonsForStudent;
