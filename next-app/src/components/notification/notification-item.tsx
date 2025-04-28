"use client";

import { useReadNotification } from "@/hooks/mutations/notification/use-read-notification";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";

interface Notification {
  id: string;
  message: string;
  type: string;
  itemId: string;
  handleOpen: () => void;
}

const image = {
  LESSON: "/assets/images/new-lesson.png",
  EXERCISE: "/assets/images/new-exercise.png",
  COMPLETION: "/assets/images/new-completion.png",
};

export default function NotificationItem({
  id,
  itemId,
  type,
  message,
  handleOpen,
}: Notification) {
  const { mutate } = useReadNotification();
  const handleRead = (notificationId: string) => {
    mutate([notificationId]);
  };

  return (
    <>
      <DropdownMenuItem key={id}>
        <Link
          href={`/eleve/lecons/${itemId}`}
          className="w-full p-2 rounded-md bg-background hover:bg-accent transition-colors"
          onClick={() => {
            handleRead(id);
            handleOpen();
          }}
        >
          <div className="flex items-center gap-2">
            <div>
              <Image
                src={image[type as keyof typeof image]}
                alt={type}
                width={50}
                height={50}
                className="h-full w-auto object-cover"
              />
            </div>
            <div className="w-full flex flex-col">
              <span className="font-semibold text-accent-foreground">
                Nouvelle leçon ajoutée
              </span>
              <p> {message}</p>
            </div>
          </div>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </>
  );
}
