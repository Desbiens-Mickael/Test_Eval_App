"use client";

import Image from "next/image";
import Link from "next/link";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface Notification {
  id: string;
  message: string;
  type: string;
  itemId: string;
}

const image = {
  LESSON: "/assets/images/new-lesson.png",
  EXERCISE: "/assets/images/new-exercise.png",
  COMPLETION: "/assets/images/new-completion.png",
};

export default function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <DropdownMenuItem key={notification.id}>
      <Link
        href={`/eleve/lecons/${notification.itemId}`}
        className="w-full p-2 rounded-md bg-background hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <div>
            <Image
              src={image[notification.type as keyof typeof image]}
              alt={notification.type}
              width={50}
              height={50}
              className="h-full w-auto object-cover"
            />
          </div>
          <div className="w-full flex flex-col">
            <span className="font-semibold text-accent-foreground">
              Nouvelle leçon ajoutée
            </span>
            <p> {notification.message}</p>
          </div>
        </div>
      </Link>
    </DropdownMenuItem>
  );
}
