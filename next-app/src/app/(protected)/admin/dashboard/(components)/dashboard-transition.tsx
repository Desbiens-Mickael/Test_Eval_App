"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useTransition } from "react";

type TransitionContextValue = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export const useDashboardTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useDashboardTransition doit être utilisé dans DashboardTransition");
  }
  return context;
};

/**
 * Partage l'état de chargement entre les filtres et le contenu :
 * pendant un changement de filtre, le contenu garde son rendu précédent
 * avec une opacité réduite (pas de squelette, pas de saut de mise en page).
 */
export function DashboardTransition({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <TransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isPending } = useDashboardTransition();
  return (
    <div
      aria-busy={isPending}
      className={cn(
        "flex flex-col gap-4 transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {children}
    </div>
  );
}
