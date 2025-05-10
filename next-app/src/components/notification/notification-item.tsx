"use client";

import { useReadNotification } from "@/hooks/mutations/notification/use-read-notification";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface Notification {
  id: string;
  message: string;
  type: string;
  itemId: string;
  createdAt: Date;
  createdStudentId?: string;
  createdTeacherId?: string;
  handleOpen: () => void;
}

const getNotificationHref = (
  type: string,
  itemId: string,
  createdStudentId?: string,
  createdTeacherId?: string
) => {
  switch (type) {
    case "LESSON":
      return {
        image: "/assets/images/new-lesson.png",
        title: "Nouvelle leçon ajoutée",
        href: `/eleve/lecons/${itemId}`,
      };
    case "EXERCISE":
      return {
        image: "/assets/images/new-exercise.png",
        title: "Nouvel exercice ajouté",
        href: `/eleve/exercices/${itemId}`,
      };
    case "COMPLETION":
      return {
        image: "/assets/images/new-completion.png",
        title: "Exercice terminé",
        href: `/admin/eleves/${createdStudentId}/exercices/correction/${itemId}`,
      };
    default:
      return {
        image: "/assets/images/new-lesson.png",
        title: "Nouvelle leçon ajoutée",
        href: "/eleve/lecons",
      };
  }
};

export default function NotificationItem({
  id,
  itemId,
  type,
  message,
  createdAt,
  createdStudentId,
  createdTeacherId,
  handleOpen,
}: Notification) {
  const { mutate } = useReadNotification();

  const handleRead = (notificationId: string) => {
    mutate([notificationId]);
  };

  const { image, title, href } = getNotificationHref(
    type,
    itemId,
    createdStudentId
  );
  console.log(createdStudentId);
  return (
    <div className="group">
      <DropdownMenuItem
        key={id}
        className="p-0 hover:bg-transparent focus:bg-transparent"
      >
        <Link
          href={href}
          className="w-full p-3 rounded-lg 
            flex items-center gap-4 
            hover:bg-gray-200 dark:hover:bg-gray-600 
            transition-all duration-300 ease-in-out 
            hover:shadow-md"
          onClick={() => {
            handleRead(id);
            handleOpen();
          }}
        >
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt={title}
              width={60}
              height={60}
              className="rounded-full object-cover 
                w-14 h-14 
                border-2 border-gray-200 dark:border-gray-600
                group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatRelative(new Date(createdAt), new Date(), {
                  locale: fr,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {message}
            </p>
          </div>
        </Link>
      </DropdownMenuItem>
    </div>
  );
}
