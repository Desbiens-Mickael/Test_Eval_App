import { logoutAction } from "@/actions/logout.action";
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
    <Button variant={theme} className={className} onClick={() => logoutAction()}>
      {!icon ? <LogOut data-testid="logout-icon" className="mr-4" /> : icon}
      <span className="text-lg font-bold">{text}</span>
    </Button>
  );
}
