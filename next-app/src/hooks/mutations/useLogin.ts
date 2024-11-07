import login from "@/actions/login";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.twoFactor) {
        toast.success("Un code de vérification vient de vous être envoyé.");
      }
      if (data?.success) {
        toast.success(data.success);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });
};

export default useLogin;
