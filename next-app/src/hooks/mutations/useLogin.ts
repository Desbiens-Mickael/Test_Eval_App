import loginAction from "@/actions/login.action";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      if (data?.twoFactor) {
        toast.success("Un code de vérification vient de vous être envoyé.");
      }
      if (data?.success) {
        toast.success(data.success);
      }
      if (data?.redirect) {
        // Le middleware envoie chacun vers son espace (professeur ou parent)
        window.location.replace("/");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });
};

export default useLogin;
