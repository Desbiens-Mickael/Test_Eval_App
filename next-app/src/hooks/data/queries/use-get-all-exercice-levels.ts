import getExerciceLevels from "@/actions/exercice/get-exercice-levels";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting all exercice levels.
 * @returns {Promise} a promise resolving to all exercice levels
 */
const useGetAllExerciceLevels = () => {
  return useQuery({
    queryKey: ["allExerciceLevels"],
    queryFn: async () => getExerciceLevels(),
  });
};

export default useGetAllExerciceLevels;
