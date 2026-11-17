import {
  clearLoginFailuresData,
  getLockRemainingData,
  recordLoginFailureData,
} from "@/data/login-throttle.data";
import {
  ACCOUNT_POLICY,
  IP_POLICY,
  accountKey,
  ipKey,
  lockMessage,
} from "@/lib/login-throttle";

/**
 * Garde des connexions : vérifie le blocage, compte les échecs, remet à zéro
 * après une connexion réussie. Utilisé par les actions de connexion (message
 * clair) et par `authorize` de NextAuth (appel direct de l'API).
 */

type LoginAttempt = {
  kind: "user" | "student";
  /** Email du professeur ou identifiant de l'élève, tel que saisi */
  login: string;
  ip: string | null;
};

/**
 * Adresse IP du client d'après les en-têtes du proxy.
 * Null si inconnue : le compteur par IP est alors ignoré, pour ne pas
 * regrouper tous les visiteurs sous une même clé.
 */
export const getClientIp = (headers: Headers) => {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || null;
};

/** Message de blocage, ou null si la tentative est autorisée */
export const checkLoginLock = async ({ kind, login, ip }: LoginAttempt) => {
  const remaining = await getLockRemainingData([
    accountKey(kind, login),
    ipKey(ip),
  ]);
  return remaining > 0 ? lockMessage(remaining, kind) : null;
};

/** Compte une tentative ratée (mauvais mot de passe ou mauvais code) */
export const recordLoginFailure = async ({ kind, login, ip }: LoginAttempt) => {
  await recordLoginFailureData([
    { key: accountKey(kind, login), policy: ACCOUNT_POLICY },
    { key: ipKey(ip), policy: IP_POLICY },
  ]);
};

/** Connexion réussie ou mot de passe réinitialisé : le compte repart de zéro */
export const clearAccountFailures = async (
  kind: "user" | "student",
  login: string
) => {
  await clearLoginFailuresData([accountKey(kind, login)]);
};
