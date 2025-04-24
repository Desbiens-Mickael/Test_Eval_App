import loginStudentAction from "@/actions/login-student.action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useStudentLogin = () => {
  return useMutation({
    mutationFn: loginStudentAction,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });
};

export default useStudentLogin;
