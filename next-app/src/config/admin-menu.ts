import { MenuSideBar } from "@/type/sidebar-type";

const adminMenus: MenuSideBar = [
  {
    group: "General",
    items: [
      {
        icon: "LayoutDashboard",
        title: "Tableau de bord",
        href: "/admin/dashboard",
      },
      {
        icon: "Trello",
        title: "Jeux de carte",
        href: "/admin/card-game",
      },
      {
        icon: "WholeWord",
        title: "Jeux à trou",
        href: "/admin/hole-game",
      },
      {
        icon: "ListTodo",
        title: "Jeux vrai / faux",
        href: "/admin/boolean-game",
      },
      {
        icon: "ListCollapse",
        title: "Jeux à liste",
        href: "/admin/list-game",
      },
    ],
  },
  {
    group: "Utilisateurs",
    items: [
      {
        icon: "Users",
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
        icon: "User",
        title: "Mon profil",
        href: "/acount/profile",
      },
    ],
  },
];

export default adminMenus;
