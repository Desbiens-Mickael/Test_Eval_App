import { getExerciceLevelsAction } from "@/actions/exercice-levels.action";
import { Level } from "@/type/level";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * Hook for getting all exercice levels.
 * @returns {Promise} a promise resolving to all exercice levels
 */
const useGetAllExerciceLevels = (): UseQueryResult<Level[], Error> => {
  return useQuery({
    queryKey: ["allExerciceLevels"],
    queryFn: async () => getExerciceLevelsAction(),
  });
};

export default useGetAllExerciceLevels;
