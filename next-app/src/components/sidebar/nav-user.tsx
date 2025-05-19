"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ChevronsUpDown, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import LogoutButton from "../auth/logout-button";
import UserItem from "../user/user-item";

export default function NavUser() {
  const { isMobile } = useSidebar();

  const user = useCurrentUser() as User;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserItem
                fullName={user.name ?? ""}
                email={user.email ?? ""}
                avatarUrl={user.image ?? ""}
              />
              <ChevronsUpDown className="ml-auto" size={20} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserItem
                  fullName={user.name ?? ""}
                  email={user.email ?? ""}
                  avatarUrl={user.image ?? ""}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={user.role === "ADMIN" ? "/admin/profil" : "/eleve/profil"}
                className="flex items-center gap-2 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer"
              >
                <UserIcon size={16} />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton
                className="w-full h-auto text-sm justify-start cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive py-1 focus:bg-destructive/50"
                variant="ghost"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
