"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  onboardingKey,
  readOnboardingFlag,
  writeOnboardingFlag,
} from "@/lib/onboarding-storage";
import { X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TOUR_STEPS, isTourRole } from "./tour-steps";
import { useTourStore } from "./tour-store";

const GAP = 12;
const MARGIN = 16;
const PADDING = 6;

type Rect = { top: number; left: number; width: number; height: number };

/** Cible visible à l'écran (le menu replié sur mobile ne compte pas) */
const findTarget = (target?: string): HTMLElement | null => {
  if (!target) return null;
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const visible =
    r.width > 0 &&
    r.height > 0 &&
    r.right > 0 &&
    r.left < window.innerWidth &&
    getComputedStyle(el).visibility !== "hidden";
  return visible ? el : null;
};

/** Place la bulle à droite de la cible, sinon dessous, sinon dessus */
const placeCard = (
  target: Rect | null,
  card: { width: number; height: number }
): { top: number; left: number } => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), Math.max(min, max));

  if (!target) {
    return { top: (vh - card.height) / 2, left: (vw - card.width) / 2 };
  }

  const right = target.left + target.width + GAP;
  if (right + card.width <= vw - MARGIN) {
    return {
      top: clamp(target.top, MARGIN, vh - card.height - MARGIN),
      left: right,
    };
  }
  const left = clamp(target.left, MARGIN, vw - card.width - MARGIN);
  const below = target.top + target.height + GAP;
  if (below + card.height <= vh - MARGIN) return { top: below, left };
  return {
    top: clamp(target.top - card.height - GAP, MARGIN, vh - card.height - MARGIN),
    left,
  };
};

/**
 * Visite guidée : se lance seule à la première connexion de chaque compte,
 * puis à la demande avec le bouton « ? » de l'en-tête.
 */
export default function OnboardingTour() {
  const user = useCurrentUser();
  const { open, step, start, close, goTo } = useTourStore();
  const role = isTourRole(user?.role) ? user.role : null;
  const steps = role ? TOUR_STEPS[role] : [];
  const current = steps[step];
  const storageKey = user?.id ? onboardingKey("tour-seen", user.id) : null;

  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Première connexion de ce compte sur ce navigateur : lancement automatique
  useEffect(() => {
    if (!storageKey || !role || readOnboardingFlag(storageKey)) return;
    const timer = window.setTimeout(start, 700);
    return () => window.clearTimeout(timer);
  }, [storageKey, role, start]);

  const finish = useCallback(() => {
    if (storageKey) writeOnboardingFlag(storageKey, true);
    close();
    returnFocusRef.current?.focus?.();
  }, [storageKey, close]);

  // Mesure la cible et place la bulle (à chaque étape, au défilement, au redimensionnement)
  const measure = useCallback(() => {
    if (!current) return;
    const el = findTarget(current.target);
    const r = el?.getBoundingClientRect();
    const rect = r
      ? {
          top: r.top - PADDING,
          left: r.left - PADDING,
          width: r.width + PADDING * 2,
          height: r.height + PADDING * 2,
        }
      : null;
    setTargetRect(rect);
    const card = cardRef.current;
    if (card) {
      setCardPos(placeCard(rect, { width: card.offsetWidth, height: card.offsetHeight }));
    }
  }, [current]);

  useLayoutEffect(() => {
    if (!open || !current) return;
    findTarget(current.target)?.scrollIntoView({ block: "nearest" });
    measure();
  }, [open, current, measure]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure]);

  // Focus : on retient l'élément d'origine, puis on suit le bouton principal
  useEffect(() => {
    if (open && !returnFocusRef.current) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
    }
    if (!open) returnFocusRef.current = null;
  }, [open]);

  useEffect(() => {
    if (open) primaryRef.current?.focus();
  }, [open, step]);

  const isLast = step === steps.length - 1;
  const next = useCallback(() => {
    if (isLast) finish();
    else goTo(step + 1);
  }, [isLast, finish, goTo, step]);
  const previous = useCallback(() => {
    if (step > 0) goTo(step - 1);
  }, [goTo, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, finish, next, previous]);

  if (!mounted || !open || !current) return null;

  // Cible dans le menu replié (mobile) : on indique où l'ouvrir
  const hiddenNavTarget = current.target?.startsWith("nav-") && !targetRect;

  return createPortal(
    <div className="fixed inset-0 z-[100]" aria-live="polite">
      {/* Bloque les clics sur la page pendant la visite */}
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} />
      {/* Voile sombre percé autour de la cible */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <mask id="tour-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx={8}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="black"
          fillOpacity={0.55}
          mask="url(#tour-spotlight)"
        />
      </svg>
      {targetRect && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-lg ring-2 ring-primary"
          style={targetRect}
        />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-text"
        className="absolute w-[min(360px,calc(100vw-32px))] rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl transition-[top,left] duration-200"
        style={
          cardPos ?? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
        }
      >
        <button
          type="button"
          onClick={finish}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Fermer la visite"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-medium text-muted-foreground">
          Étape {step + 1} sur {steps.length}
        </p>
        <h2 id="tour-title" className="mt-1 pr-6 text-lg font-semibold">
          {current.title}
        </h2>
        <p id="tour-text" className="mt-2 text-sm text-muted-foreground">
          {current.text}
          {hiddenNavTarget && (
            <span className="mt-2 block">
              {role === "STUDENT"
                ? "Tu le trouveras dans le menu, avec le bouton en haut à gauche."
                : "Vous le trouverez dans le menu, avec le bouton en haut à gauche."}
            </span>
          )}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          {!isLast ? (
            <button
              type="button"
              onClick={finish}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Passer la visite
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={previous}>
                Précédent
              </Button>
            )}
            <Button ref={primaryRef} size="sm" onClick={next}>
              {isLast ? "Terminer" : step === 0 ? "C'est parti" : "Suivant"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
