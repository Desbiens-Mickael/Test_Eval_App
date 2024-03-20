"use client";

import { logout } from "@/actions/logout";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  text?: string;
  className?: string;
  icon?: JSX.Element;
  theme?: "default" | "destructive" | "secondary" | "link" | "outline" | "ghost" | null | undefined;
}

export default function LogoutButton({ text = "Déconnexion", className, icon, theme = "secondary" }: LogoutButtonProps) {
  return (
    <Button variant={theme} className={className} onClick={() => logout()}>
      {!icon ? <LogOut className="mr-4" /> : icon}
      <span className="text-lg font-bold">{text}</span>
    </Button>
  );
}
