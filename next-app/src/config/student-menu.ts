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
        tourId: "nav-dashboard",
      },
      {
        icon: Book,
        title: "Mes leçons",
        href: "/eleve/lecons",
        tourId: "nav-lecons",
      },
      {
        icon: Dumbbell,
        title: "Exercices",
        href: "/eleve/entrainements",
        tourId: "nav-entrainements",
      },
      {
        icon: ListTodo,
        title: "Contrôles à faire",
        href: "/eleve/exercices",
        tourId: "nav-controles-a-faire",
      },
      {
        icon: Check,
        title: "Contrôles faits",
        href: "/eleve/exercices/faits",
        tourId: "nav-controles-faits",
      },
    ],
  },
];

export default userMenus;
