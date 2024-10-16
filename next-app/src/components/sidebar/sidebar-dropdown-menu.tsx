"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MenuItem } from "@/type/sidebar";
import { ChevronDown } from "lucide-react";
import SidebarItem from "./sidebar-item";

interface SidebarDRopdownMenuProps extends MenuItem {
  className?: string;
}

/**
 * SidebarDropdownMenu Component
 *
 * This component renders a dropdown menu item in the sidebar, including a title and icon.
 * If there are submenus, they are rendered recursively using the `SidebarItem` component.
 *
 * @param {SidebarDropdownMenuProps} props - The properties of the component.
 * @param {React.ComponentType} props.icon - A React component representing the icon for the dropdown menu item.
 * @param {string} props.title - The title of the dropdown menu item.
 * @param {MenuItem[]} [props.submenus] - Optional submenus to be rendered recursively within the dropdown.
 * @param {string} [props.className] - Optional class names for custom styling.
 *
 * @returns {JSX.Element} - A JSX element representing the dropdown menu item in the sidebar.
 *
 * @component
 * @example
 * // Example usage
 * <SidebarDropdownMenu
 *   icon={LayoutDashboard}
 *   title="Exercises"
 *   submenus={[
 *     { icon: Trello, title: "Card Games", href: "/admin/card-game" },
 *     { icon: ListTodo, title: "True/False Games", href: "/admin/boolean-game" },
 *   ]}
 * />
 */
export default function SidebarDRopdownMenu({ icon: Icon, title, submenus }: SidebarDRopdownMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full h-full">
        <div className="w-full h-full flex items-center gap-3 text-primary font-bold rounded-md hover:bg-slate-200 transition-all p-2">
          <Icon />
          <h3>{title}</h3>
          <ChevronDown className="ml-auto" size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[250px]">
        {submenus?.map((submenu, submenuKey) => (
          <DropdownMenuItem key={submenuKey} className="p-0">
            {/* As long as there are sub-menus, they are displayed recursively */}
            <SidebarItem menu={submenu} key={submenuKey} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
