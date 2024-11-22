import { getAllLessonsSubjectsAction } from "@/actions/lesson-subjects.action";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting all lesson subjects.
 * @returns {Promise} a promise resolving to all lesson subjects
 */
const useGetAllLessonsSubject = () => {
  return useQuery({
    queryKey: ["allLessonsSubject"],
    queryFn: async () => getAllLessonsSubjectsAction(),
  });
};

export default useGetAllLessonsSubject;
