"use client";

import LogoutButton from "@/components/auth/logout-button";
import { UserItemSkeleton } from "@/components/skeleton/user-item-skeleton";
import UserItem from "@/components/user/user-item";
import adminMenus from "@/config/admin-menu";
import userMenus from "@/config/user-menu";
import { useCurrentUser } from "@/hooks/use-current-user";

import SidebarItem from "./sidebar-item";

export default function Sidebar() {
  const user = useCurrentUser();

  const menus = user?.role === "ADMIN" ? adminMenus : userMenus;

  return (
    <div className="fixed flex flex-col bg-primary p-4 w-[300px] min-w-[300px] top-0 bottom-0 overflow-auto scrollbar-hide scrollbar-thin">
      {user ? <UserItem fullName={user.name ?? ""} email={user.email ?? ""} avatarUrl={user.image ?? ""} /> : <UserItemSkeleton />}

      <nav className="flex flex-col gap-8 grow py-8 text-primary-foreground">
        {menus.map(({ group, menus }, groupKey) => (
          <div className="flex flex-col gap-2 bg-primary-foreground rounded-md p-2" key={groupKey}>
            <h3 className="text-primary font-bold text-xl px-2">{group}</h3>

            {menus.map((menu, menuKey) => (
              <SidebarItem menu={menu} key={menuKey} />
            ))}
          </div>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
