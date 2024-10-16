import { MenuSideBar } from "@/type/sidebar";
import { LayoutDashboard, ListCollapse, ListTodo, NotebookPen, Trello, User, Users, WholeWord } from "lucide-react";

const adminMenus: MenuSideBar = [
  {
    group: "General",
    menus: [
      {
        icon: LayoutDashboard,
        title: "Tableau de bord",
        href: "/admin/dashboard",
      },
      {
        icon: NotebookPen,
        title: "Exercices",
        submenus: [
          {
            icon: Trello,
            title: "Jeux de carte",
            href: "/admin/card-game",
          },
          {
            icon: WholeWord,
            title: "Jeux à trou",
            href: "/admin/fill-blank-game",
          },
          {
            icon: ListTodo,
            title: "Jeux vrai / faux",
            href: "/admin/boolean-game",
          },
          {
            icon: ListCollapse,
            title: "Jeux à liste",
            href: "/admin/list-game",
          },
        ],
      },
    ],
  },
  {
    group: "Utilisateurs",
    menus: [
      {
        icon: Users,
        title: "Inscrits",
        href: "/admin/registered",
      },
    ],
  },
  {
    group: "Paramètres",
    menus: [
      {
        icon: User,
        title: "Mon profil",
        href: "/acount/profile",
      },
    ],
  },
];

export default adminMenus;
