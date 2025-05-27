"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface ButtonResetProps {
  text?: string;
  onClick: () => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ButtonReset({
  onClick,
  isPending,
  disabled,
  className,
  text,
}: ButtonResetProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick()}
      className={cn(
        "rounded-full px-4 h-10 gap-2 text-muted-foreground hover:text-foreground",
        className
      )}
      disabled={disabled || isPending}
    >
      <RefreshCw className="h-4 w-4" />
      {text && <span>{text}</span>}
    </Button>
  );
}
