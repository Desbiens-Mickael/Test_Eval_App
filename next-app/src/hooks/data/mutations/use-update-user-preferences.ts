import updateUserPreferences from "@/actions/update-user-preferences";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUserPreferences = () => {
  return useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: (data) => {
      console.log(data);
    },
  });
};
