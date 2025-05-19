"use client";

import { generateUserInitials } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import { UserItemSkeleton } from "./user-item-skeleton";

interface UserItemProps {
  fullName: string;
  email: string;
  avatarUrl?: string;
}
// TODO: mettre à jour pour la version header et mobile
export default function UserItem({
  fullName,
  email,
  avatarUrl,
}: UserItemProps) {
  const initialTitle = generateUserInitials(fullName);

  return (
    <Suspense fallback={<UserItemSkeleton />}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          width={32}
          height={32}
          alt={fullName}
          className="rounded-full"
          quality={75}
          priority={true}
        />
      ) : (
        initialTitle
      )}
      <div className="grid flex-1 text-left text-sm leading-tight ms-2">
        <span className="truncate font-semibold">{fullName}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </Suspense>
  );
}
