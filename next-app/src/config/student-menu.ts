import { MenuSideBar } from "@/type/sidebar";
import { LayoutDashboard, User } from "lucide-react";

const userMenus: MenuSideBar = [
  {
    group: "General",
    menus: [
      {
        icon: LayoutDashboard,
        title: "Tableau de bord",
        href: "/eleve/dashboard",
      },
    ],
  },
  {
    group: "Paramètres",
    menus: [
      {
        icon: User,
        title: "Mon profil",
        href: "/eleve/profil",
      },
    ],
  },
];

export default userMenus;
