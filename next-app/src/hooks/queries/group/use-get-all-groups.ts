import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getAllGroupsAction } from "@/actions/group.action";
import { Group } from "@/type/group";

export const useGetAllGroups = (): UseQueryResult<Group[], Error> => {
  return useQuery({
    queryKey: ["allGroups"],
    queryFn: async () => {
      const response = await getAllGroupsAction();

      if (response.error) {
        throw { message: response.error };
      }

      return response.data;
    },
  });
};
