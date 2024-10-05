import getAllExercicesByType from "@/actions/exercice/get-all-exercices-by-type";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesCard = () => {
  return useQuery({
    queryKey: ["allExercicesCard"],
    queryFn: async () => getAllExercicesByType("Card"),
  });
};

export default useGetAllExercicesCard;
