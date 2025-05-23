"use client";
import adminMenus from "@/config/admin-menu";
import studentMenus from "@/config/student-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import Logo from "../logo";
import SidebarItem from "./sidebar-item";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import NavUser from "./nav-user";

export default function AppSidebar() {
  const user = useCurrentUser() as User;

  const { isMobile, state } = useSidebar();

  const menus = user?.role === "ADMIN" ? adminMenus : studentMenus;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div
          className={cn(
            "flex justify-center items-center w-full rounded-md",
            state === "collapsed" && !isMobile
              ? "bg-transparent"
              : "bg-background"
          )}
        >
          <Link href={"/"}>
            <Logo
              width={state === "collapsed" && !isMobile ? 50 : 100}
              height={state === "collapsed" && !isMobile ? 50 : 50}
              type={
                state === "collapsed" && !isMobile ? "mobile" : "horizontal"
              }
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menus.map(({ group, menus }, groupKey) => (
          <SidebarGroup key={groupKey}>
            <SidebarGroupLabel className="text-foreground font-bold text-xl px-2">
              {group}
            </SidebarGroupLabel>

            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {menus.map((menu, menuKey) => (
                  <SidebarItem menu={menu} key={menuKey} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
