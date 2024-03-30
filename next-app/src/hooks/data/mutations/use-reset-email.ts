import { ResetEmail } from "@/actions/reset-email";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useResetEmail = () => {
  return useMutation({
    mutationFn: ResetEmail,
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) toast.error(data.success);
    },
  });
};

export default useResetEmail;
