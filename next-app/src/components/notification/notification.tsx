"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReadNotification } from "@/hooks/mutations/notification/use-read-notification";
import useGetNotification from "@/hooks/queries/notification/use-get-notification";
import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import NotificationItem from "./notification-item";

export default function Notification() {
  const [open, setOpen] = useState(false);
  const { data } = useGetNotification();
  const { mutate } = useReadNotification();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleReadAll = () => {
    const notificationIds = data?.map((notification) => notification.id) || [];
    mutate(notificationIds);
  };
  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="text-foreground" size={25} />
          {data && data.length > 0 && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center
              w-5 h-5 text-xs font-bold text-white
              bg-primary rounded-full
              animate-pulse"
            >
              {data.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[350px] max-h-[500px] overflow-y-auto
        bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-xl"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <DropdownMenuLabel className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </DropdownMenuLabel>
          {data && data.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
              onClick={() => {
                handleReadAll();
                handleOpen();
              }}
            >
              <CheckCheck size={16} className="mr-2" />
              Tout marquer
            </Button>
          )}
        </div>

        {data && data.length > 0 ? (
          <div className="divide-y dark:divide-gray-700">
            {data.map((notification) => {
              if (!notification.isRead) {
                return (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    message={notification.notification.message}
                    createdAt={notification.notification.createdAt}
                    type={notification.notification.type}
                    itemId={
                      notification.notification.lessonId ||
                      notification.notification.exerciseId ||
                      notification.notification.completionId ||
                      ""
                    }
                    createdStudentId={
                      notification.notification.createdByStudentId || ""
                    }
                    createdTeacherId={
                      notification.notification.createdByTeacherId || ""
                    }
                    handleOpen={handleOpen}
                  />
                );
              }
            })}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            <p className="italic">Aucune notification</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
