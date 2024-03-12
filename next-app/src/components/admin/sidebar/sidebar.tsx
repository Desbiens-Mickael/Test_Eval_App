"use client";

import LogoutButton from "@/components/auth/logout-button";
import { UserItemSkeleton } from "@/components/skeleton/user-item-skeleton";
import { LayoutDashboard, ListCollapse, ListTodo, Trello, User, Users, WholeWord } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import UserItem from "../../user-item";
import LinkSidebar from "./link-sidebar";

const menus = [
  {
    group: "General",
    items: [
      {
        icon: <LayoutDashboard />,
        title: "Tableau de bord",
        link: "/admin/dashboard",
        callback: undefined,
      },
      {
        icon: <Trello />,
        title: "Jeux de carte",
        link: "/admin/card-game",
        callback: undefined,
      },
      {
        icon: <WholeWord />,
        title: "Jeux à trou",
        link: "/admin/hole-game",
        callback: undefined,
      },
      {
        icon: <ListTodo />,
        title: "Jeux vrai / faux",
        link: "/admin/boolean-game",
        callback: undefined,
      },
      {
        icon: <ListCollapse />,
        title: "Jeux à liste",
        link: "/admin/list-game",
        callback: undefined,
      },
    ],
  },
  {
    group: "Utilisateurs",
    items: [
      {
        icon: <Users />,
        title: "Inscrits",
        link: "/admin/registered",
        callback: () => {
          return 3;
        },
      },
    ],
  },
  {
    group: "Paramètres",
    items: [
      {
        icon: <User />,
        title: "Mon profil",
        link: "/admin/me",
        callback: undefined,
      },
    ],
  },
];

export default function Sidebar() {
  const { data } = useSession();
  const pathName = usePathname();
  const user = data?.user;

  return (
    <div className="fixed flex flex-col bg-primary p-4 w-[300px] min-w-[300px] min-h-screen">
      {user ? <UserItem firstname={user.name ?? ""} lastname="" email={user.email ?? ""} avatarUrl={user.image ?? ""} /> : <UserItemSkeleton />}

      <nav className="flex flex-col gap-8 grow py-8 text-primary-foreground">
        {menus.map(({ group, items }, groupKey) => (
          <div className="flex flex-col gap-2 bg-primary-foreground rounded-md p-2" key={groupKey}>
            <h2 className="text-primary font-bold text-xl px-2">{group}</h2>

            {items.map((menu, menuKey) => (
              <LinkSidebar
                key={menuKey}
                href={menu.link}
                title={menu.title}
                icon={menu.icon}
                callback={menu.callback}
                className={pathName === menu.link ? "bg-primary text-primary-foreground hover:bg-primary" : ""}
              />
            ))}
          </div>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
