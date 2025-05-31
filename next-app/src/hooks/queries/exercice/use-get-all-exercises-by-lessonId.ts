import { getExercicesByLessonIdAction } from "@/actions/exercice.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface ExerciceResponse {
  id: string;
  title: string;
  description: string;
  level: string;
  levelColor: string;
  type: string;
  groups: { id: string }[];
}

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesByLessonId = (
  lessonId: string
): UseQueryResult<ExerciceResponse[] | undefined, Error> => {
  return useQuery({
    queryKey: ["allExercicesByLessonId", lessonId],
    queryFn: async () => {
      const response = await getExercicesByLessonIdAction(lessonId);

      if (response.error) {
        toast.error(response.error);
        return [];
      }
      return response.data;
    },
  });
};

export default useGetAllExercicesByLessonId;
