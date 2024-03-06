"use client";

import Image from "next/image";

interface UserItemProps {
  title: string;
  description: string;
  avatarUrl?: string;
}

export default function UserItem({ title, description, avatarUrl }: UserItemProps) {
  const initialTitle = title.split(" ").map((word) => word.split("")[0].toUpperCase());

  return (
    <div className="flex items-center gap-2 w-full border rounded-md p-2 bg-primary-foreground">
      <div className="min-w-10 min-h-10 rounded-full bg-primary flex justify-center items-center text-lg text-primary-foreground font-bold">
        {avatarUrl ? <Image src={avatarUrl} width={10} height={10} alt="profile" /> : initialTitle}
      </div>
      <div className="grow">
        <p className="text-[16px] text-primary font-bold">{title}</p>
        <p className="text-[12px] text-primary font-medium">{description}</p>
      </div>
    </div>
  );
}
