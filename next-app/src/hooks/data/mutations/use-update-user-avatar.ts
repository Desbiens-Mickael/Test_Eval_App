import updateAvatar from "@/actions/update-avatar";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/**
 * Function for updating user avatar.
 *
 * @param {FormData} formData - the form data for the new avatar
 * @return {Promise} a promise resolving to the updated avatar
 */
export const useUpdateUserAvatar = () => {
  const { update, data } = useSession();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const img = data?.user?.image?.split("/").pop();

      await fetch(`http://localhost:8000/avatar/${img}`, {
        method: "DELETE",
      });

      const res = await fetch(`http://localhost:8000/avatar`, {
        method: "POST",
        body: formData,
      });

      const { image_path } = await res.json();
      const imgPath = `http://upload-service:8000/avatar/${image_path}`;
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
