import { LucideIcon } from "lucide-react";

export type MenuItem = {
  icon: LucideIcon;
  title: string;
  href?: string;
  submenus?: MenuItem[];
};

export type MenuSideBar = Array<{ group: string; menus: MenuItem[] }>;
