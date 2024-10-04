import getAllExercicesCard from "@/actions/exercice/get-all-exercices-card";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting all exercices card.
 * @returns {Promise} a promise resolving to all exercices card
 */
const useGetAllExercicesCard = () => {
  return useQuery({
    queryKey: ["allExercicesCard"],
    queryFn: async () => getAllExercicesCard(),
  });
};

export default useGetAllExercicesCard;
