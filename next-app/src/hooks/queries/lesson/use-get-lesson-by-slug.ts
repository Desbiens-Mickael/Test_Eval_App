import { getLessonBySlugAction } from "@/actions/lesson.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetLessonBySlug = (slug: string): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["lessonBySlug", slug],
    queryFn: async () => {
      const response = await getLessonBySlugAction(slug);
      // Désérialiser le contenu
      if (response.lesson) {
        const parsedData = {
          ...response.lesson,
          content: JSON.parse(response.lesson.content)
        };
        return { ...response, lesson: parsedData };
      }
      return response;
    },
  });
};

export default useGetLessonBySlug;