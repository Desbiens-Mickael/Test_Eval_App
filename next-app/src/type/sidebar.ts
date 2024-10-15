export type MenuItem = {
  icon: string;
  title: string;
  href: string;
  submenus?: MenuItem[];
};

export type MenuSideBar = Array<{ group: string; menus: MenuItem[] }>;
