import { logoutAction } from "@/actions/logout.action";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  text?: string;
  className?: string;
  icon?: JSX.Element;
  variant?:
    | "default"
    | "destructive"
    | "secondary"
    | "link"
    | "outline"
    | "ghost"
    | null
    | undefined;
  iconSize?: number;
}

const LogoutButton = React.forwardRef<HTMLButtonElement, LogoutButtonProps>(
  (
    {
      text = "Déconnexion",
      className,
      icon,
      variant = "destructive",
      iconSize = 16,
    }: LogoutButtonProps,
    ref
  ) => (
    <Button
      ref={ref}
      variant={variant}
      className={cn("cursor-pointer", className)}
      onClick={() => logoutAction()}
    >
      {!icon ? (
        <LogOut data-testid="logout-icon" className="mr-4" size={iconSize} />
      ) : (
        icon
      )}
      <span>{text}</span>
    </Button>
  )
);

export default LogoutButton;
