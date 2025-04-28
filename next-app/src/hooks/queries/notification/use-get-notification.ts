import { getNotifications } from "@/actions/notification.action";
import { Notification } from "@/type/notification";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for getting all notifications.
 * @returns {Promise} a promise resolving to all notifications
 */
const useGetNotification = (): UseQueryResult<Notification[], Error> => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotifications();

      if (response.error) {
        toast.error(response.error);
        return [];
      }

      return response.data;
    },
  });
};

export default useGetNotification;
