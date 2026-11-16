import { MenuSideBar } from "@/type/sidebar";
import { Book, Check, Dumbbell, LayoutDashboard, ListTodo } from "lucide-react";

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
        icon: Dumbbell,
        title: "Exercices",
        href: "/eleve/entrainements",
      },
      {
        icon: ListTodo,
        title: "Contrôles à faire",
        href: "/eleve/exercices",
      },
      {
        icon: Check,
        title: "Contrôles faits",
        href: "/eleve/exercices/faits",
      },
    ],
  },
];

export default userMenus;
