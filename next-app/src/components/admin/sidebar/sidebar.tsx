"use client";

import { ListCollapse, ListTodo, LogOut, Trello, WholeWord } from "lucide-react";
import { usePathname } from "next/navigation";
import UserItem from "../../user-item";
import LinkSidebar from "./link-sidebar";

const user = {
  firstname: "Mélinda",
  lastname: "Desbiens",
  email: "desbiens.melinda@gmail.com",
  avatarUrl: "http://upload-service:8000/image/135fbb96-216a-4a25-8fa2-59c25245f1db.webp",
};

const menus = [
  {
    group: "General",
    items: [
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
        icone: "",
        title: "Mon compte",
        link: "/me",
      },
      // {
      //   icone: "",
      //   title: "",
      //   link: "",
      // },
    ],
  },
];

export default function Sidebar() {
  const pathName = usePathname();

  return (
    <div className="fixed flex flex-col bg-primary p-4 w-[300px] min-w-[300px] min-h-screen">
      <UserItem {...user} />
      <div className="flex flex-col gap-4 grow py-4 text-primary-foreground">
        {menus.map((group, groupKey) => (
          <div className="flex flex-col gap-2 bg-primary-foreground rounded-md p-2" key={groupKey}>
            <h2 className="text-primary font-bold text-xl px-2">{group.group}</h2>
            {group.items.map((menu, menuKey) => (
              <LinkSidebar href={menu.link} title={menu.title} icon={menu.icone} className={pathName === menu.link ? "bg-slate-200 " : ""} key={menuKey} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex text-primary-foreground ">
        <LogOut className="mr-4" />
        Déconnéxion
      </div>
    </div>
  );
}
