"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
        <Button variant="ghost" size="icon" className="rounded-full p-2">
          <div className="relative">
            <Bell className="text-foreground" size={25} />
            {data && data.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                {data.length}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data && data.length > 0 ? (
          <div>
            {data.map((notification) => {
              if (!notification.isRead) {
                return (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    message={notification.notification.message}
                    type={notification.notification.type}
                    itemId={
                      notification.notification.lessonId ||
                      notification.notification.exerciseId ||
                      ""
                    }
                    handleOpen={handleOpen}
                  />
                );
              }
            })}
            <Button
              variant={"outline"}
              className="w-full flex items-center gap-2"
              onClick={() => {
                handleReadAll();
                handleOpen();
              }}
            >
              <CheckCheck size={18} className="text-primary" />
              Marquer comme lues
            </Button>
          </div>
        ) : (
          <DropdownMenuItem>Aucune notification</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
