import { LucideIcon } from "lucide-react";

export type MenuItem = {
  icon: LucideIcon;
  title: string;
  href?: string;
  submenus?: MenuItem[];
  /** Repère de la visite guidée (attribut data-tour) */
  tourId?: string;
};

export type MenuSideBar = Array<{ group: string; menus: MenuItem[] }>;
