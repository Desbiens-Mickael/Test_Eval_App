"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { MenuItem } from "@/type/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
export default function SidebarDRopdownMenu({
  icon: Icon,
  title,
  submenus,
}: SidebarDRopdownMenuProps): JSX.Element {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const styleMain =
    "w-full h-full flex items-center gap-3 font-bold rounded-md transition-all p-2";

  const { isMobile } = useSidebar();

  const checkActiveSubmenu = useCallback(() => {
    // Vérifie si le href d'un enfant est identique au chemin d'accès
    const foundItem = submenus?.find((item) => item.href === pathname);
    setIsActive(!!foundItem);
  }, [pathname, submenus]);

  useEffect(() => {
    checkActiveSubmenu();
  }, [checkActiveSubmenu]);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary">
              <Icon size={20} />
            </div>
            <h3>{title}</h3>
            <ChevronsUpDown className="ml-auto" size={20} />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg2"
          align="start"
          side={isMobile ? "bottom" : "right"}
          sideOffset={4}
        >
          <SidebarMenuSub className="border-l-0 mx-0">
            {submenus?.map((submenu, submenuKey) => (
              <SidebarMenuSubItem key={submenuKey}>
                <SidebarItem menu={submenu} key={submenuKey} isChild={true} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
