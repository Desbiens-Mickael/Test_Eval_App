import getAllExercicesByType from "@/actions/exercice/get-all-exercices-by-type";
import { ExerciceType } from "@prisma/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Exercice } from "@/type/exercice";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesByType = (type: ExerciceType): UseQueryResult<Exercice[], Error> => {
  return useQuery({
    queryKey: ["allExercicesByType", type],
    queryFn: async () => getAllExercicesByType(type),
  });
};

export default useGetAllExercicesByType;
