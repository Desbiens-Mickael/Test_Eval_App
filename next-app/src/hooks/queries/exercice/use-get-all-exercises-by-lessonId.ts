import { getExercicesByLessonIdAction } from "@/actions/exercice.action";
import { Exercice } from "@/type/exercice";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesByLessonId = (
  lessonId: string
): UseQueryResult<Exercice[], Error> => {
  return useQuery({
    queryKey: ["allExercicesByLessonId", lessonId],
    queryFn: async () => {
      const response = await getExercicesByLessonIdAction(lessonId);

      if (response.error) {
        toast.error(response.error);
      }
      return response.data;
    },
  });
};

export default useGetAllExercicesByLessonId;
