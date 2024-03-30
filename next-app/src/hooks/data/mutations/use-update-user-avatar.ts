import updateAvatar from "@/actions/update-avatar";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useUpdateUserAvatar = () => {
  const { update } = useSession();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("http://localhost:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });
      const { image_path } = await res.json();
      const imgPath = `http://upload-service:8000/image/${image_path}`;
      return updateAvatar(imgPath);
    },
    onSuccess: (data) => {
      if (data.error) toast.error(data.error);
      if (data.success) {
        toast.success(data.success);
        update({});
      }
    },
  });
};
