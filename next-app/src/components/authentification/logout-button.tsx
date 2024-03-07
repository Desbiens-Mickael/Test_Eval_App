"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  text?: string;
  className?: string;
  icon?: React.ReactNode;
  theme?: "default" | "destructive" | "secondary" | "link" | "outline" | "ghost" | null | undefined;
}

export default function LogoutButton({ text = "Déconnexion", className, icon, theme = "secondary" }: LogoutButtonProps) {
  const router = useRouter();
  const handleLogout = (id: number) => {
    try {
      alert(`utilisateur ${id} déconecter`);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button variant={theme} className={className} onClick={() => handleLogout(2)}>
      {!icon ? <LogOut className="mr-4" /> : icon}
      <span className="text-lg font-bold">{text}</span>
    </Button>
  );
}
