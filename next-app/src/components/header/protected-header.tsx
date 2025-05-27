"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { ModeToggle } from "../dark-mode/mode-toggle";
import Notification from "../notification/notification";

export default function ProtectedHeader() {
  return (
    <header
      className={
        "w-full shrink-0 h-16 flex justify-between items-center gap-2 py-4 px-6"
      }
    >
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <Notification />
        <Separator
          orientation="vertical"
          className="w-[2px] h-[25px] bg-border"
        />
        <ModeToggle />
      </div>
    </header>
  );
}
