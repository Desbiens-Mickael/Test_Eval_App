import { MenuSideBar } from "@/type/sidebar";
import { Atom, BookOpenText, Calculator, CaseUpper, Hourglass, LayoutDashboard, ListCollapse, ListTodo, NotebookPen, Trello, User, Users, WholeWord } from "lucide-react";

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
            title: "A trou",
            href: "/admin/exercices/a-trous",
          },
          {
            icon: ListTodo,
            title: "Vrai / faux",
            href: "/admin/exercices/vrai-faux",
          },
          {
            icon: ListCollapse,
            title: "Liste",
            href: "/admin/exercices/liste",
          },
        ],
      },
    ],
  },
  {
    group: "Utilisateurs",
    menus: [
      {
        icon: Users,
        title: "Inscrits",
        href: "/admin/utilisateurs",
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
