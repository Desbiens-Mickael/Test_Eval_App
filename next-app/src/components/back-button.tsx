"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  text?: string;
  className?: string;
}

export default function BackButton({ text, className }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className={cn("mb-6 -ml-2", className)}
      onClick={() => router.back()}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {text || "Retour"}
    </Button>
  );
}
