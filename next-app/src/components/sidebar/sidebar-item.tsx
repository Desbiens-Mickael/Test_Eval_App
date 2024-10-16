"use client";

import { MenuItem } from "@/type/sidebar";
import { usePathname } from "next/navigation";
import LinkSidebar from "./link-sidebar";
import SidebarDRopdownMenu from "./sidebar-dropdown-menu";

/**
 * SidebarItem Component
 *
 * This component is responsible for rendering either a simple link (`LinkSidebar`) or a dropdown menu (`SidebarDropdownMenu`)
 * depending on whether the menu has submenus (`submenus`). This component is used recursively to handle nested menus dynamically.
 *
 * @param {Object} props - The properties of the component.
 * @param {MenuItem} props.menu - A `MenuItem` object representing a menu item.
 *
 * @returns {JSX.Element} - A JSX element representing either a link (`LinkSidebar`) or a dropdown menu (`SidebarDropdownMenu`).
 *
 * @component
 * @example
 * // Example usage in a parent component
 * <SidebarItem menu={menu} />
 */
export default function SidebarItem({ menu }: { menu: MenuItem }): JSX.Element {
  const pathName = usePathname();

  return menu.href && !menu.submenus ? <LinkSidebar {...menu} className={pathName === menu.href ? "bg-primary text-primary-foreground hover:bg-primary" : ""} /> : <SidebarDRopdownMenu {...menu} />;
}
