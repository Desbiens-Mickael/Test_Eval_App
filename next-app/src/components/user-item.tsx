"use client";

import { capitalize } from "@/utils/stringUtils";
import Image from "next/image";

interface UserItemProps {
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl?: string;
}

export default function UserItem({ firstname, lastname, email, avatarUrl }: UserItemProps) {
  const fullName = capitalize(firstname) + " " + capitalize(lastname);
  const initialTitle = firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 w-full border rounded-md p-2 bg-primary-foreground">
      <div className="min-w-12 min-h-12 max-w-10 max-h-10 rounded-full bg-primary flex justify-center items-center text-lg text-primary-foreground font-bold overflow-hidden">
        {avatarUrl ? <Image src={avatarUrl} width={50} height={50} alt="profile" /> : initialTitle}
      </div>
      <div className="grow">
        <p className="text-[16px] text-primary font-bold">{fullName}</p>
        <p className="text-[12px] text-primary font-medium">{email}</p>
      </div>
    </div>
  );
}
