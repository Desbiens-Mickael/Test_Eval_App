import { getExerciceByIdAction } from "@/actions/exercice.action";
import { Exercice } from "@/type/exercice";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetExerciceById = (id: string): UseQueryResult<Exercice, Error> => {
  return useQuery({
    queryKey: ["exercice", id],
    queryFn: async () => {
      const response = await getExerciceByIdAction(id);
      if (response.error) {
        throw { message: response.error };
      }
      return response.data;
    },
  });
};

export default useGetExerciceById;
