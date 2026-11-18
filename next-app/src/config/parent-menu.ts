import { MenuSideBar } from "@/type/sidebar";
import { Settings, Users } from "lucide-react";

const parentMenus: MenuSideBar = [
  {
    group: "Espace parent",
    menus: [
      {
        icon: Users,
        title: "Mes enfants",
        href: "/parent",
      },
      {
        icon: Settings,
        title: "Paramètres",
        href: "/parent/parametres",
      },
    ],
  },
];

export default parentMenus;
