import { getAllLessonsByAuthorIdAction } from "@/actions/lesson.action";
import { Lesson } from "@/type/lesson";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

const useGetAllLessons = (): UseQueryResult<Lesson[] | [], Error> => {
  return useQuery({
    queryKey: ["allTheAuthorLessons"],
    queryFn: async () => {
      const response = await getAllLessonsByAuthorIdAction();

      if (response.error) {
        toast.error(response.error);
        return [];
      }

      return response.data;
    },
  });
};

export default useGetAllLessons;
