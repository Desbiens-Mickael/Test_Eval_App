"use client";

import { cn } from "@/lib/utils";
import { MenuItem } from "@/type/sidebar";
import Link from "next/link";

interface LinkSidebarProps extends MenuItem {
  className?: string;
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
export default function LinkSidebar({ href, icon: Icon, title, className }: LinkSidebarProps): JSX.Element {
  const styleMain = "w-full text-primary font-bold rounded-md transition-all p-2";
  const defaultStyle = "text-primary hover:bg-slate-200";

  return (
    <Link href={href ?? ""} className={cn(styleMain, className ? className : defaultStyle)}>
      <span className="flex gap-3">
        <Icon /> <span className="grow">{title}</span>
      </span>
    </Link>
  );
}
