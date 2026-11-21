import { updateStudentAvatarAction } from "@/actions/avatar.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { mediaUrl } from "@/lib/media-url";
import { toast } from "sonner";

/**
 * Hook for updating user avatar.
 *
 * @param {FormData} formData - the form data for the new avatar
 * @return {Promise} a promise resolving to the updated avatar
 */
export const useUpdateStudentAvatar = () => {
  const { update, data } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const img = data?.user?.image?.split("/").pop();
      if (img) {
        await fetch(`/api/upload/avatar/${img}`, {
          method: "DELETE",
        });
      }

      const res = await fetch(`/api/upload/avatar`, {
        method: "POST",
        body: formData,
      });

      const { image_path } = await res.json();
      const imgPath = mediaUrl("avatar", image_path);
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
