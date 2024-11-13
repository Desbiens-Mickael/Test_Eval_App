import { getAllLessonsBySubject } from "@/actions/lesson/get-all-lesson-by-subject";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetAllLessonsBySubject = (subject: string): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["allLessonsBySubject", subject],
    queryFn: async () => getAllLessonsBySubject(subject),
  });
};

export default useGetAllLessonsBySubject;
