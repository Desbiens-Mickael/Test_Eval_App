"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Separator } from "@radix-ui/react-separator";
import { ModeToggle } from "../dark-mode/mode-toggle";
import Notification from "../notification/notification";
import TourHelpButton from "../onboarding/tour-help-button";

export default function ProtectedHeader() {
  // Les parents sont prévenus par e-mail : pas de cloche de notifications
  const user = useCurrentUser();
  const showNotifications = user?.role === "ADMIN" || user?.role === "STUDENT";

  return (
    <header
      className={
        "w-full shrink-0 h-16 flex justify-between items-center gap-2 py-4 px-6"
      }
    >
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        {showNotifications && (
          <>
            <span data-tour="header-notifications" className="inline-flex">
              <Notification />
            </span>
            <Separator
              orientation="vertical"
              className="w-[2px] h-[25px] bg-border"
            />
          </>
        )}
        <TourHelpButton />
        <ModeToggle />
      </div>
    </header>
  );
}
