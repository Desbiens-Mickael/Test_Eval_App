"use client";

import { useReadNotification } from "@/hooks/mutations/notification/use-read-notification";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  const handleRead = (notificationId: string) => {
    mutate([notificationId]);
  };

  const { image, title, href } = getNotificationHref(
    type,
    itemId,
    createdStudentId
  );

  return (
    <DropdownMenuItem
      onClick={() => {
        if (href) {
          router.push(href);
        }
        handleRead(id);
        handleOpen();
      }}
      key={id}
      className="group w-full p-3 hover:bg-muted
            transition-all duration-300 ease-in-out 
            hover:shadow-md cursor-pointer
            flex items-center gap-4"
    >
      <div className="flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={60}
          height={60}
          className="rounded-full object-cover 
                w-14 h-14 
                border-2 border-muted
                group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formatRelative(new Date(createdAt), new Date(), {
              locale: fr,
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
      </div>
    </DropdownMenuItem>
  );
}
