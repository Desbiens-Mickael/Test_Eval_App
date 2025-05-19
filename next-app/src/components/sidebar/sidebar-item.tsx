"use client";

import { MenuItem } from "@/type/sidebar";
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
export default function SidebarItem({
  menu,
  isChild,
}: {
  menu: MenuItem;
  isChild?: boolean;
}): JSX.Element {
  return menu.href && !menu.submenus ? (
    <LinkSidebar {...menu} isChild={isChild} />
  ) : (
    <SidebarDRopdownMenu {...menu} />
  );
}
