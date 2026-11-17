import { getExercicesPageAction } from "@/actions/exercice.action";
import { PageQueryInput } from "@/shema-zod/pagination.shema";
import { ExerciceType } from "@/type/exercice";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/** Une page des exercices ou contrôles d'un type ; la page précédente reste affichée pendant le chargement */
export const useGetExercicesPage = (
  type: ExerciceType,
  kind: "CONTROL" | "PRACTICE",
  query: PageQueryInput
) => {
  return useQuery({
    // Préfixe ["allExercicesByType", type] : les invalidations existantes s'appliquent
    queryKey: ["allExercicesByType", type, kind, query],
    queryFn: async () => {
      const response = await getExercicesPageAction(type, kind, query);
      if (response.error || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export type ExerciceRow = NonNullable<
  ReturnType<typeof useGetExercicesPage>["data"]
>["items"][number];
