"use client";

import { getExercisesDoneAction } from "@/actions/exercice.action";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface GetExercisesDoneProps {
  subject?: string;
  studentId?: string;
  /** Numéro de page, à partir de 1 */
  page?: number;
}

/** Une page des copies d'un élève, de la plus récente à la plus ancienne */
export const useGetExercisesDone = ({ subject, studentId, page = 1 }: GetExercisesDoneProps) => {
  return useQuery({
    queryKey: ["exercises-done", subject, studentId, page],
    queryFn: async () => {
      const response = await getExercisesDoneAction(subject, studentId, { page });
      if (response.error || !response.data) {
        toast.error(response.error);
        return null;
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
