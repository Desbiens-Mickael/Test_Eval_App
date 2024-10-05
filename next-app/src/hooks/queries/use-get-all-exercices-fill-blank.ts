import getAllExercicesByType from "@/actions/exercice/get-all-exercices-by-type";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesFillBlank = () => {
  return useQuery({
    queryKey: ["allExercicesFillBlank"],
    queryFn: async () => getAllExercicesByType("Fill_blank"),
  });
};

export default useGetAllExercicesFillBlank;
