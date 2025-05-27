import { getLessonByIdForStudentAction } from "@/actions/lesson.action";
import { LessonForStudent } from "@/type/lesson";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

const useGetLessonByIdForStudent = (
  id: string
): UseQueryResult<LessonForStudent | null, Error> => {
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
        return parsedData;
      }
      if (response.error) {
        toast.error(response.error);
      }
      return null;
    },
    retry: false, // Ne pas reessayer si la requête échoue
    enabled: !!id, // Permet de ne pas faire de requête si l'id est vide
  });
};

export default useGetLessonByIdForStudent;
