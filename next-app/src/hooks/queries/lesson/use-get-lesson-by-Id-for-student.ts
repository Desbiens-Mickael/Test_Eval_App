import { getLessonByIdForStudentAction } from "@/actions/lesson.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetLessonByIdForStudent = (id: string): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["lessonByIdForStudent", id],
    queryFn: async () => {
      const response = await getLessonByIdForStudentAction(id);
      // Désérialiser le contenu
      if (response.lesson) {
        const parsedData = {
          ...response.lesson,
          content: JSON.parse(response.lesson.content),
        };
        return { ...response, lesson: parsedData };
      }
      return response;
    },
  });
};

export default useGetLessonByIdForStudent;
