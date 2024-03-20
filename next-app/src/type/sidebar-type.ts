export interface MenuItem {
  icon: string;
  title: string;
  href: string;
  infos?: string;
}

export type MenuSideBar = Array<{ group: string; items: MenuItem[] }>;
