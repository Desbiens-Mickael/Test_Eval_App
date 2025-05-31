import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getGroupByIdAction } from "@/actions/group.action";

interface GroupResponse {
  id: string;
  name: string;
  authorId: string;
  createdAt: Date;
  students: {
    id: string;
    name: string;
    identifier: string;
    isActive: boolean;
  }[];
  lessons: {
    id: string;
    title: string;
    slug: string;
    subject: string;
    subjectColor: string;
    gradeLevel: string;
    gradeLevelColor: string;
  }[];
}

export const useGetGroupById = (
  id: string
): UseQueryResult<GroupResponse | undefined, Error> => {
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
