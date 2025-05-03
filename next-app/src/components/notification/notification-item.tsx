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

const InfosNotification = {
  LESSON: {
    image: "/assets/images/new-lesson.png",
    title: "Nouvelle leçon ajoutée",
    href: "/eleve/lecons",
  },
  EXERCISE: {
    image: "/assets/images/new-exercise.png",
    title: "Nouvel exercice ajouté",
    href: "/eleve/exercices",
  },
  COMPLETION: {
    image: "/assets/images/new-completion.png",
    title: "Exercice terminé",
    href: "/correction/progression",
  },
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
          href={`${
            InfosNotification[type as keyof typeof InfosNotification].href
          }/${itemId}`}
          className="w-full p-2 rounded-md bg-background hover:bg-accent transition-colors"
          onClick={() => {
            handleRead(id);
            handleOpen();
          }}
        >
          <div className="flex items-center gap-2">
            <div>
              <Image
                src={
                  InfosNotification[type as keyof typeof InfosNotification]
                    .image
                }
                alt={
                  InfosNotification[type as keyof typeof InfosNotification]
                    .title
                }
                width={50}
                height={50}
                className="h-full w-auto object-cover"
              />
            </div>
            <div className="w-full flex flex-col">
              <span className="font-semibold text-accent-foreground">
                {
                  InfosNotification[type as keyof typeof InfosNotification]
                    .title
                }
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
