import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllLessonsNotInGroupAction } from "@/actions/lesson.action";

const useGetAllLessonsNotInGroup = (
  groupId: string
): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["allLessonsNotInGroup", groupId],
    queryFn: async () => {
      const response = await getAllLessonsNotInGroupAction(groupId);

      if (response.error) {
        toast.error(response.error);
        return [];
      }

      return response.data;
    },
    enabled: !!groupId, // désactive la requête si le groupId n'est pas défini
  });
};

export default useGetAllLessonsNotInGroup;
