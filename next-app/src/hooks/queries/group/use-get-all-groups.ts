import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getAllGroupsAction } from "@/actions/group.action";

interface GroupListItem {
  name: string;
  id: string;
  createdAt: Date;
  authorId: string;
  students: {
    id: string;
    identifier: string;
  }[];
}

export const useGetAllGroups = (): UseQueryResult<
  GroupListItem[] | undefined,
  Error
> => {
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
