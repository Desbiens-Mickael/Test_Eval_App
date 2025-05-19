import { MenuSideBar } from "@/type/sidebar";
import { Book, Check, LayoutDashboard, ListTodo } from "lucide-react";

const userMenus: MenuSideBar = [
  {
    group: "General",
    menus: [
      {
        icon: LayoutDashboard,
        title: "Tableau de bord",
        href: "/eleve/dashboard",
      },
      {
        icon: Book,
        title: "Mes leçons",
        href: "/eleve/lecons",
      },
      {
        icon: ListTodo,
        title: "Exercices à faire",
        href: "/eleve/exercices",
      },
      {
        icon: Check,
        title: "Exercices faits",
        href: "/eleve/exercices/faits",
      },
    ],
  },
];

export default userMenus;
