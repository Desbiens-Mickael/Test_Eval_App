import getAllExercicesByType from "@/actions/exercice/get-all-exercices-by-type";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesTrueFalse = () => {
  return useQuery({
    queryKey: ["allExercicesTrueFalse"],
    queryFn: async () => getAllExercicesByType("True_or_False"),
  });
};

export default useGetAllExercicesTrueFalse;
