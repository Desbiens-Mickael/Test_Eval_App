"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Separator } from "@radix-ui/react-separator";
import Notification from "../notification/notification";
import UserItem from "../user/user-item";

export default function ProtectedHeader() {
  const user = useCurrentUser();
  return (
    <header
      className={
        "w-full shrink-0 h-16 flex justify-between items-center gap-2 py-4 px-6"
      }
    >
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <Notification />
        <Separator
          orientation="vertical"
          className="w-[2px] h-[25px] bg-border"
        />
        <UserItem
          fullName={user?.name ?? ""}
          email={user?.email ?? ""}
          avatarUrl={user?.image ?? ""}
        />
      </div>
    </header>
  );
}
