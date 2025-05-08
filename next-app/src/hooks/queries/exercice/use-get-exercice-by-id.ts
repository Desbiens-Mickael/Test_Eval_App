import { getExerciceByIdAction } from "@/actions/exercice.action";
import { Exercice } from "@/type/exercice";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
const useGetExerciceById = (
  id: string
): UseQueryResult<Exercice | null, Error> => {
  return useQuery({
    queryKey: ["exercice", id],
    queryFn: async () => {
      const response = await getExerciceByIdAction(id);
      if (response.error) {
        toast.error(response.error);
      }
      return response.data;
    },
    retry: false,
  });
};

export default useGetExerciceById;
