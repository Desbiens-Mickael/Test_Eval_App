"use client";

import LogoutButton from "@/components/auth/logout-button";
import LinkSidebar from "@/components/sidebar/link-sidebar";
import { UserItemSkeleton } from "@/components/skeleton/user-item-skeleton";
import UserItem from "@/components/user-item";
import adminMenus from "@/config/admin-menu";
import userMenus from "@/config/user-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LayoutDashboard, ListCollapse, ListTodo, Trello, User, Users, WholeWord } from "lucide-react";
import { usePathname } from "next/navigation";

type IconName = "LayoutDashboard" | "Trello" | "ListCollapse" | "ListTodo" | "User" | "Users" | "WholeWord";

const iconMap: { [key in IconName]: JSX.Element } = {
  LayoutDashboard: <LayoutDashboard />,
  Trello: <Trello />,
  ListCollapse: <ListCollapse />,
  ListTodo: <ListTodo />,
  User: <User />,
  Users: <Users />,
  WholeWord: <WholeWord />,
};

export default function Sidebar() {
  const pathName = usePathname();
  const user = useCurrentUser();

  const menus = user?.role === "ADMIN" ? adminMenus : userMenus;

  return (
    <div className="fixed flex flex-col bg-primary p-4 w-[300px] min-w-[300px] min-h-screen">
      {user ? <UserItem fullName={user.name ?? ""} email={user.email ?? ""} avatarUrl={user.image ?? ""} /> : <UserItemSkeleton />}

      <nav className="flex flex-col gap-8 grow py-8 text-primary-foreground">
        {menus.map(({ group, items }, groupKey) => (
          <div className="flex flex-col gap-2 bg-primary-foreground rounded-md p-2" key={groupKey}>
            <h2 className="text-primary font-bold text-xl px-2">{group}</h2>

            {items.map((item, menuKey) => {
              const IconComponent = item.icon in iconMap ? iconMap[item.icon as IconName] : null;
              const newItem = { ...item, icon: IconComponent };

              return <LinkSidebar key={menuKey} {...newItem} className={pathName === item.href ? "bg-primary text-primary-foreground hover:bg-primary" : ""} />;
            })}
          </div>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
