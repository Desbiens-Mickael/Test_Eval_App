"use client";

import LogoutButton from "@/components/auth/logout-button";
import adminMenus from "@/config/admin-menu";
import studentMenus from "@/config/student-menu";
import { useCurrentUser } from "@/hooks/use-current-user";

import { User } from "next-auth";
import Link from "next/link";
import Logo from "../logo";
import SidebarItem from "./sidebar-item";

export default function Sidebar() {
  const user = useCurrentUser() as User;

  const menus = user?.role === "ADMIN" ? adminMenus : studentMenus;

  return (
    <div className="fixed flex flex-col bg-foreground p-4 w-[300px] min-w-[300px] top-0 bottom-0 overflow-auto scrollbar-hide scrollbar-thin">
      <div className="flex justify-center items-center w-full bg-background rounded-md">
        <Link href={"/"}>
          <Logo width={100} height={50} type="horizontal" />
        </Link>
      </div>

      <nav className="flex flex-col gap-8 grow py-8 text-foreground">
        {menus.map(({ group, menus }, groupKey) => (
          <div
            className="flex flex-col gap-2 bg-background rounded-md p-2"
            key={groupKey}
          >
            <h3 className="text-foreground font-bold text-xl px-2">{group}</h3>

            {menus.map((menu, menuKey) => (
              <SidebarItem menu={menu} key={menuKey} />
            ))}
          </div>
        ))}
      </nav>
      <LogoutButton theme={"destructive"} />
    </div>
  );
}
