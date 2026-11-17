import { getStudentsPageAction } from "@/actions/student.action";
import { PageQueryInput } from "@/shema-zod/pagination.shema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/** Une page des élèves du professeur ; la page précédente reste affichée pendant le chargement */
export const useGetStudentsPage = (query: PageQueryInput) => {
  return useQuery({
    // Préfixe « AllStudents » : les invalidations existantes s'appliquent
    queryKey: ["AllStudents", query],
    queryFn: async () => {
      const response = await getStudentsPageAction(query);
      if (response.error || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export type StudentRow = NonNullable<
  ReturnType<typeof useGetStudentsPage>["data"]
>["items"][number];
