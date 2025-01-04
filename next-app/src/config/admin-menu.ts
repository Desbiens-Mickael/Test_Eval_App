import { MenuSideBar } from "@/type/sidebar";
import {
  Atom,
  BookOpenText,
  Calculator,
  CaseUpper,
  Hourglass,
  LayoutDashboard,
  ListCollapse,
  ListTodo,
  NotebookPen,
  Plus,
  Trello,
  User,
  Users,
  WholeWord,
} from "lucide-react";

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
        icon: BookOpenText,
        title: "Leçons",
        submenus: [
          {
            icon: CaseUpper,
            title: "Français",
            href: "/admin/lecons/francais",
          },
          {
            icon: Calculator,
            title: "Mathématique",
            href: "/admin/lecons/mathematique",
          },
          {
            icon: Hourglass,
            title: "Histoire",
            href: "/admin/lecons/histoire",
          },
          {
            icon: Atom,
            title: "Physique",
            href: "/admin/lecons/physique",
          },
        ],
      },
      {
        icon: NotebookPen,
        title: "Exercices",
        submenus: [
          {
            icon: Trello,
            title: "Carte",
            href: "/admin/exercices/carte",
          },
          {
            icon: WholeWord,
            title: "Texte à trou",
            href: "/admin/exercices/texte-a-trou",
          },
          {
            icon: ListTodo,
            title: "Vrai / faux",
            href: "/admin/exercices/vrai-ou-faux",
          },
          {
            icon: ListCollapse,
            title: "Choix multiple",
            href: "/admin/exercices/choix-multiple",
          },
        ],
      },
    ],
  },
  {
    group: "Groupe",
    menus: [
      {
        icon: Users,
        title: "Mes groupes",
        href: "/admin/groupes",
      },
    ],
  },
  {
    group: "Paramètres",
    menus: [
      {
        icon: User,
        title: "Mon profil",
        href: "/profil",
      },
    ],
  },
];

export default adminMenus;
