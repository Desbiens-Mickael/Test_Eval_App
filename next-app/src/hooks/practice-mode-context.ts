"use client";

import type { PracticeAttemptResult } from "@/actions/exercice-practice.action";
import { createContext, useContext } from "react";

/**
 * Présent uniquement autour d'un exercice d'entraînement : la réponse est
 * enregistrée comme essai (non noté) et seule la note est remontée ici,
 * au lieu de rediriger vers une correction.
 */
export type PracticeMode = { onResult: (result: PracticeAttemptResult) => void };

export const PracticeModeContext = createContext<PracticeMode | null>(null);

export const usePracticeMode = () => useContext(PracticeModeContext);
