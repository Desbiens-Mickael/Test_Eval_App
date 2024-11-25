"use client";

import { cn, generateUserInitials } from "@/lib/utils";
import Image from "next/image";
import { UserItemSkeleton } from "../skeleton/user-item-skeleton";

interface UserItemProps {
  fullName: string;
  email: string;
  avatarUrl?: string;
  className?: string;
}
// TODO: mettre à jour pour la version header et mobile
export default function UserItem({ fullName, email, avatarUrl, className }: UserItemProps) {
  const initialTitle = generateUserInitials(fullName);

  return (
    <>
      {fullName ? (
        <div className={cn("flex items-center gap-2 w-fit border rounded-md p-2 bg-background", className)}>
          <div className="min-w-12 min-h-12 max-w-10 max-h-10 rounded-full bg-foreground flex justify-center items-center text-lg text-primary-foreground font-bold overflow-hidden">
            {avatarUrl ? <Image src={avatarUrl} width={50} height={50} alt="profile" /> : initialTitle}
          </div>
          <div className="grow">
            <p className="text-[16px] text-foreground font-bold">{fullName}</p>
            <p className="text-[12px] text-foreground font-medium">{email}</p>
          </div>
        </div>
      ) : (
        <UserItemSkeleton />
      )}
    </>
  );
}
