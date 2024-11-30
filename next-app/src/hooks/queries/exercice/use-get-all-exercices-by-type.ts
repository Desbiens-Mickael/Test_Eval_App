import { getAllExercicesByTypeAction } from "@/actions/exercice.action";
import { Exercice, ExerciceType } from "@/type/exercice";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesByType = (
  type: ExerciceType
): UseQueryResult<Exercice[], Error> => {
  return useQuery({
    queryKey: ["allExercicesByType", type],
    queryFn: async () => getAllExercicesByTypeAction(type),
  });
};

export default useGetAllExercicesByType;
