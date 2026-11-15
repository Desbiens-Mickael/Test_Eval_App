import { importStudentsAction } from "@/actions/student-import.action";
import { ImportRow } from "@/lib/student-import";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Crée les comptes des élèves importés */
export const useImportStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: ImportRow[]) => importStudentsAction(rows),
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["AllStudents"] });
        queryClient.invalidateQueries({ queryKey: ["allGroups"] });
      }
    },
    onError: () => toast.error("Une erreur est survenue pendant l'import."),
  });
};
