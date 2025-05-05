import { updateStudentAvatarAction } from "@/actions/avatar.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/**
 * Hook for updating user avatar.
 *
 * @param {FormData} formData - the form data for the new avatar
 * @return {Promise} a promise resolving to the updated avatar
 */
export const useUpdateStudentAvatar = () => {
  const NEXT_PUBLIC_CLIENT_DOMAIN_API =
    process.env.NEXT_PUBLIC_CLIENT_DOMAIN_API;
  const NEXT_PUBLIC_SERVER_DOMAIN_API =
    process.env.NEXT_PUBLIC_SERVER_DOMAIN_API;

  const { update, data } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const img = data?.user?.image?.split("/").pop();
      if (img) {
        await fetch(`${NEXT_PUBLIC_CLIENT_DOMAIN_API}/avatar/${img}`, {
          method: "DELETE",
        });
      }

      const res = await fetch(`${NEXT_PUBLIC_CLIENT_DOMAIN_API}/avatar`, {
        method: "POST",
        body: formData,
      });

      const { image_path } = await res.json();
      const imgPath = `${NEXT_PUBLIC_SERVER_DOMAIN_API}/avatar/${image_path}`;
      return updateStudentAvatarAction(imgPath);
    },
    onSuccess: (data) => {
      if (data.error) toast.error(data.error);
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["studentByIdentifier"] });
        update({});
      }
    },
  });
};
