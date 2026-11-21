"use client";

import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import { useTourStore } from "./tour-store";

/** Relance la visite guidée */
export default function TourHelpButton() {
  const start = useTourStore((s) => s.start);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={start}
      data-tour="header-help"
      aria-label="Revoir la visite guidée"
      title="Revoir la visite guidée"
    >
      <CircleHelp className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
