import { getAllLessonsBySubjectAction } from "@/actions/lesson.action";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useGetAllLessonsBySubject = (subject: string): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["allLessonsBySubject", subject],
    queryFn: async () => getAllLessonsBySubjectAction(subject),
  });
};

export default useGetAllLessonsBySubject;
