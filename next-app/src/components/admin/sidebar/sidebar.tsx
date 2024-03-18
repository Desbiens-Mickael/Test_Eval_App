"use client";

import LogoutButton from "@/components/auth/logout-button";
import { UserItemSkeleton } from "@/components/skeleton/user-item-skeleton";
import { LayoutDashboard, ListCollapse, ListTodo, Trello, User, Users, WholeWord } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import UserItem from "../../user-item";
import LinkSidebar from "./link-sidebar";

interface MenuItem {
  icon: JSX.Element;
  title: string;
  href: string;
  infos?: string;
}

const menus: Array<{ group: string; items: MenuItem[] }> = [
  {
    group: "General",
    items: [
      {
        icon: <LayoutDashboard />,
        title: "Tableau de bord",
        href: "/admin/dashboard",
      },
      {
        icon: <Trello />,
        title: "Jeux de carte",
        href: "/admin/card-game",
      },
      {
        icon: <WholeWord />,
        title: "Jeux à trou",
        href: "/admin/hole-game",
      },
      {
        icon: <ListTodo />,
        title: "Jeux vrai / faux",
        href: "/admin/boolean-game",
      },
      {
        icon: <ListCollapse />,
        title: "Jeux à liste",
        href: "/admin/list-game",
      },
    ],
  },
  {
    group: "Utilisateurs",
    items: [
      {
        icon: <Users />,
        title: "Inscrits",
        href: "/admin/registered",
        infos: "3", // Rendre dynamique
      },
    ],
  },
  {
    group: "Paramètres",
    items: [
      {
        icon: <User />,
        title: "Mon profil",
        href: "/admin/me",
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
      {user ? <UserItem fullName={user.name ?? ""} email={user.email ?? ""} avatarUrl={user.image ?? ""} /> : <UserItemSkeleton />}

      <nav className="flex flex-col gap-8 grow py-8 text-primary-foreground">
        {menus.map(({ group, items }, groupKey) => (
          <div className="flex flex-col gap-2 bg-primary-foreground rounded-md p-2" key={groupKey}>
            <h2 className="text-primary font-bold text-xl px-2">{group}</h2>

            {items.map((menu, menuKey) => (
              <LinkSidebar key={menuKey} {...menu} className={pathName === menu.href ? "bg-primary text-primary-foreground hover:bg-primary" : ""} />
            ))}
          </div>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
