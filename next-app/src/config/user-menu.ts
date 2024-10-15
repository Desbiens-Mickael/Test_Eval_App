import { MenuSideBar } from "@/type/sidebar";

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
        href: "/acount/profile",
      },
    ],
  },
];

export default userMenus;
