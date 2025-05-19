"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/type/sidebar";
import Link from "next/link";
import { useIsPathActive } from "./hooks/useIsPathActive";

interface LinkSidebarProps extends MenuItem {
  className?: string;
  isChild?: boolean;
}

/**
 * LinkSidebar Component
 *
 * This component is responsible for rendering a sidebar link item with an icon and a title.
 * It takes properties such as `href` (link URL), `icon` (React component for the icon), `title` (link title), and optional `className`.
 *
 * @param {LinkSidebarProps} props - The properties of the component.
 * @param {string} props.href - The URL to navigate to when the link is clicked.
 * @param {React.ComponentType} props.icon - A React component representing the icon for the link => ( LucideIcon ).
 * @param {string} props.title - The title of the sidebar link.
 * @param {string} [props.className] - Optional class names for custom styling.
 *
 * @returns {JSX.Element} - A JSX element representing the link.
 *
 * @component
 * @example
 * // Example usage
 * <LinkSidebar
 *   href="/admin/dashboard"
 *   icon={LayoutDashboard}
 *   title="Dashboard"
 * />
 */
export default function LinkSidebar({
  href,
  icon: Icon,
  title,
  className,
  isChild,
}: LinkSidebarProps): JSX.Element {
  const isActive = useIsPathActive(href);

  const styleMain =
    "w-full font-semibold rounded-md transition-all p-0 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground";

  // Rendu conditionnel en fonction de isChild
  return isChild ? (
    <DropdownMenuItem asChild>
      <SidebarMenuSubButton
        asChild
        isActive={isActive}
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer text-sidebar-primary"
      >
        <Link href={href ?? ""} className={cn(styleMain, className)}>
          <div className="mr-2 flex aspect-square size-7 items-center justify-center rounded-lg">
            <Icon size={18} />
          </div>
          <span className="grow">{title}</span>
        </Link>
      </SidebarMenuSubButton>
    </DropdownMenuItem>
  ) : (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-sidebar-primary"
        {...(!isChild && { tooltip: title })}
      >
        <Link href={href ?? ""} className={cn(styleMain, className)}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Icon size={20} />
          </div>
          <span className="grow">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
