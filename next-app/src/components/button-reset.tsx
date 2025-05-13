"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ButtonResetProps {
  onClick: () => void;
  isPending: boolean;
}

export default function ButtonReset({ onClick, isPending }: ButtonResetProps) {
  return (
    <Button
      title="Reinitialiser"
      size="icon"
      onClick={onClick}
      className="bg-background text-primary hover:bg-primary hover:text-background"
      disabled={isPending}
    >
      <RefreshCcw className="h-6 w-6" />
    </Button>
  );
}
