import { updateNotifications } from "@/actions/notification.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReadNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      updateNotifications(notificationIds),
    onSuccess: (data) => {
      if (data?.error) return toast.error(data.error);
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        return data.success;
      }
    },
  });
};
