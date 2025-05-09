"use client";

import { useQuery } from "@tanstack/react-query";
import { getExercisesToDoAction } from "@/actions/exercice.action";
import { toast } from "sonner";

interface GetExercisesToDoProps {
  subject?: string;
}

export const useGetExercisesToDo = ({ subject }: GetExercisesToDoProps) => {
  return useQuery({
    queryKey: ["exercises-to-do", subject],
    queryFn: async () => {
      const response = await getExercisesToDoAction(subject);
      if (response.error) {
        toast.error(response.error);
      }
      return response.data;
    },
  });
};
