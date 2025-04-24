import { getAllLessonsByGroupIdAction } from "@/actions/lesson.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

const useGetAllLessonsByGroupId = (
  groupId: string
): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["allLessonsByGroupId", groupId],
    queryFn: async () => {
      const response = await getAllLessonsByGroupIdAction(groupId);

      if (response.error) {
        toast.error(response.error);
        return [];
      }

      return response.data;
    },
  });
};

export default useGetAllLessonsByGroupId;
