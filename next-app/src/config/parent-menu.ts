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
        tourId: "nav-enfants",
      },
      {
        icon: Settings,
        title: "Paramètres",
        href: "/parent/parametres",
        tourId: "nav-parametres",
      },
    ],
  },
];

export default parentMenus;
