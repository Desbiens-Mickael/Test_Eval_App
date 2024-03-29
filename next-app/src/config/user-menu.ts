import { MenuSideBar } from "@/type/sidebar-type";

const userMenus: MenuSideBar = [
  {
    group: "General",
    items: [
      {
        icon: "LayoutDashboard",
        title: "Tableau de bord",
        href: "/user/dashboard",
      },
    ],
  },
  {
    group: "Paramètres",
    items: [
      {
        icon: "User",
        title: "Mon profil",
        href: "/user/me",
      },
    ],
  },
];

export default userMenus;
