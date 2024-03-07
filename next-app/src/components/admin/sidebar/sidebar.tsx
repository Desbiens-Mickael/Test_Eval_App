"use client";

import LogoutButton from "@/components/authentification/logout-button";
import { LayoutDashboard, ListCollapse, ListTodo, Trello, User, WholeWord } from "lucide-react";
import { usePathname } from "next/navigation";
import UserItem from "../../user-item";
import LinkSidebar from "./link-sidebar";

const user = {
  firstname: "Mélinda",
  lastname: "Desbiens",
  email: "desbiens.melinda@gmail.com",
  avatarUrl: "http://upload-service:8000/image/54356ef6-c01b-41c7-b2b6-6cceb1dee169.webp",
};

const menus = [
  {
    group: "General",
    items: [
      {
        icone: <LayoutDashboard />,
        title: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        icone: <Trello />,
        title: "Jeu de carte",
        link: "/admin/card-game",
      },
      {
        icone: <WholeWord />,
        title: "Jeu à trou",
        link: "/admin/hole-game",
      },
      {
        icone: <ListTodo />,
        title: "Jeu vrai / faux",
        link: "/admin/boolean-game",
      },
      {
        icone: <ListCollapse />,
        title: "Jeu à liste",
        link: "/admin/list-game",
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        icone: <User />,
        title: "Mon compte",
        link: "/admin/me",
      },
    ],
  },
];

export default function Sidebar() {
  const pathName = usePathname();

  return (
    <div className="fixed flex flex-col bg-primary p-4 w-[300px] min-w-[300px] min-h-screen">
      <UserItem {...user} />
      <nav className="flex flex-col gap-8 grow py-8 text-primary-foreground">
        {menus.map((group, groupKey) => (
          <div className="flex flex-col gap-2 bg-primary-foreground rounded-md p-2" key={groupKey}>
            <h2 className="text-primary font-bold text-xl px-2">{group.group}</h2>
            {group.items.map((menu, menuKey) => (
              <LinkSidebar href={menu.link} title={menu.title} icon={menu.icone} className={pathName === menu.link ? "bg-primary text-primary-foreground hover:bg-primary" : ""} key={menuKey} />
            ))}
          </div>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
