import { getAllExercicesTypeAction } from "@/actions/exercice-type.action";
import { useQuery } from "@tanstack/react-query";

const useGetAllExerciceType = () => {
  return useQuery({
    queryKey: ["allExerciceType"],
    queryFn: async () => {
      const response = await getAllExercicesTypeAction();

      if (response.error) {
        throw { message: response.error };
      }

      return response;
    },
  });
};

export default useGetAllExerciceType;
