import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getGroupByIdAction } from "@/actions/group.action";
import { Group } from "@/type/group";

export const useGetGroupById = (id: string): UseQueryResult<Group, Error> => {
  return useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await getGroupByIdAction(id);

      if (response.error) {
        throw { message: response.error };
      }

      return response.data;
    },
  });
};
