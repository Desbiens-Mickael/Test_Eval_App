import { create } from "zustand";

type TourState = {
  open: boolean;
  step: number;
  start: () => void;
  close: () => void;
  goTo: (step: number) => void;
};

/** État de la visite guidée, partagé entre le bouton « ? » et la visite */
export const useTourStore = create<TourState>((set) => ({
  open: false,
  step: 0,
  start: () => set({ open: true, step: 0 }),
  close: () => set({ open: false }),
  goTo: (step) => set({ step }),
}));
