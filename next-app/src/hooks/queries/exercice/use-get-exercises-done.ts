"use client";

import { getExercisesDoneAction } from "@/actions/exercice.action";
import { StudentExerciceCard } from "@/type/exercice";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface GetExercisesDoneProps {
  subject?: string;
}

export const useGetExercisesDone = ({
  subject,
}: GetExercisesDoneProps): UseQueryResult<StudentExerciceCard[], Error> => {
  return useQuery({
    queryKey: ["exercises-done", subject],
    queryFn: async () => {
      const response = await getExercisesDoneAction(subject);
      if (response.error) {
        toast.error(response.error);
      }
      return response.data;
    },
  });
};
