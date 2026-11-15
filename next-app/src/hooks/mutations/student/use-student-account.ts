import {
  resetStudentPasswordAction,
  setStudentDisabledAction,
} from "@/actions/student-account.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Génère un nouveau mot de passe pour un élève */
export const useResetStudentPassword = (studentId: string) => {
  return useMutation({
    mutationFn: () => resetStudentPasswordAction(studentId),
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
    },
    onError: () => toast.error("Une erreur est survenue lors de la réinitialisation."),
  });
};

/** Désactive ou réactive le compte d'un élève */
export const useSetStudentDisabled = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disabled: boolean) => setStudentDisabledAction(studentId, disabled),
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["studentById", studentId] });
        queryClient.invalidateQueries({ queryKey: ["AllStudents"] });
      }
    },
    onError: () => toast.error("Une erreur est survenue lors de la mise à jour du compte."),
  });
};
