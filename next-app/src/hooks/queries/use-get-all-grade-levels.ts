import { getAllGradeLevelsAction } from "@/actions/grade-level.action";
import { useQuery } from "@tanstack/react-query";


const useGetAllGradeLevels = () => {
  return useQuery({
    queryKey: ["allGradeLevels"],
    queryFn: async () => getAllGradeLevelsAction(),
  });
};

export default useGetAllGradeLevels;
