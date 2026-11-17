/**
 * Limitation des tentatives de connexion.
 *
 * Deux compteurs par tentative ratée :
 * - par compte (email du professeur ou identifiant de l'élève) : protège un
 *   compte précis, même si l'attaquant change d'adresse IP ;
 * - par adresse IP, avec un seuil large : une classe entière partage souvent
 *   la même IP, quelques fautes de frappe ne doivent pas bloquer tout le monde.
 *
 * Module pur, sans accès base de données.
 */

export type ThrottlePolicy = {
  /** Nombre d'échecs qui déclenche le blocage */
  maxFailures: number;
  /** Fenêtre de comptage des échecs */
  windowMs: number;
  /** Durée du blocage */
  lockMs: number;
};

const MINUTE = 60 * 1000;

export const ACCOUNT_POLICY: ThrottlePolicy = {
  maxFailures: 5,
  windowMs: 15 * MINUTE,
  lockMs: 15 * MINUTE,
};

export const IP_POLICY: ThrottlePolicy = {
  maxFailures: 50,
  windowMs: 15 * MINUTE,
  lockMs: 15 * MINUTE,
};

export type ThrottleState = {
  failures: number;
  windowStart: Date;
  lockedUntil: Date | null;
};

/** Clé du compteur d'un compte (insensible à la casse et aux espaces) */
export const accountKey = (kind: "user" | "student", login: string) =>
  `${kind}:${login.trim().toLowerCase()}`;

/** Clé du compteur d'une IP, ou null si l'IP est inconnue */
export const ipKey = (ip: string | null | undefined) =>
  ip ? `ip:${ip}` : null;

/** Temps restant avant la fin du blocage, en ms (0 si non bloqué) */
export const lockRemainingMs = (
  state: Pick<ThrottleState, "lockedUntil"> | null,
  now: Date = new Date()
) => {
  if (!state?.lockedUntil) return 0;
  return Math.max(0, state.lockedUntil.getTime() - now.getTime());
};

/** État du compteur après un nouvel échec */
export const nextStateAfterFailure = (
  state: ThrottleState | null,
  policy: ThrottlePolicy,
  now: Date = new Date()
): ThrottleState => {
  const windowExpired =
    !state || now.getTime() - state.windowStart.getTime() >= policy.windowMs;
  // Un blocage terminé repart d'une fenêtre neuve
  const lockExpired = !!state?.lockedUntil && lockRemainingMs(state, now) === 0;

  const fresh = !state || windowExpired || lockExpired;
  const failures = fresh ? 1 : state.failures + 1;
  const windowStart = fresh ? now : state.windowStart;
  const lockedUntil =
    failures >= policy.maxFailures
      ? new Date(now.getTime() + policy.lockMs)
      : lockExpired
        ? null
        : state?.lockedUntil ?? null;

  return { failures, windowStart, lockedUntil };
};

/** Message affiché quand la connexion est bloquée (tutoiement pour l'élève) */
export const lockMessage = (
  remainingMs: number,
  audience: "user" | "student"
) => {
  const minutes = Math.max(1, Math.ceil(remainingMs / MINUTE));
  const retry = audience === "student" ? "Réessaie" : "Réessayez";
  return `Trop de tentatives de connexion. ${retry} dans ${minutes} minute${
    minutes > 1 ? "s" : ""
  }.`;
};
