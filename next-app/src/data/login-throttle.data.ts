import { prisma } from "@/lib/db";
import {
  ThrottlePolicy,
  lockRemainingMs,
  nextStateAfterFailure,
} from "@/lib/login-throttle";

/** Compteurs inactifs depuis plus d'un jour : supprimés au passage */
const STALE_MS = 24 * 60 * 60 * 1000;

/**
 * Temps de blocage restant (ms) pour un ensemble de clés : le plus long.
 * Les clés nulles (IP inconnue) sont ignorées.
 */
export const getLockRemainingData = async (
  keys: (string | null)[],
  now: Date = new Date()
) => {
  const validKeys = keys.filter((k): k is string => !!k);
  if (validKeys.length === 0) return 0;

  const rows = await prisma.loginThrottle.findMany({
    where: { key: { in: validKeys }, lockedUntil: { gt: now } },
    select: { lockedUntil: true },
  });
  return Math.max(0, ...rows.map((row) => lockRemainingMs(row, now)));
};

/**
 * Enregistre une tentative ratée pour chaque clé, avec sa politique.
 * Le calcul et l'écriture sont faits dans une transaction par clé pour que
 * deux échecs simultanés soient bien comptés tous les deux.
 */
export const recordLoginFailureData = async (
  entries: { key: string | null; policy: ThrottlePolicy }[],
  now: Date = new Date()
) => {
  for (const { key, policy } of entries) {
    if (!key) continue;
    await prisma.$transaction(async (tx) => {
      // Verrou de ligne : crée la ligne si besoin puis la relit verrouillée
      await tx.$executeRaw`
        INSERT INTO "LoginThrottle" ("key", "failures", "windowStart", "updatedAt")
        VALUES (${key}, 0, ${now}, ${now})
        ON CONFLICT ("key") DO NOTHING`;
      const [current] = await tx.$queryRaw<
        { failures: number; windowStart: Date; lockedUntil: Date | null }[]
      >`
        SELECT "failures", "windowStart", "lockedUntil"
        FROM "LoginThrottle" WHERE "key" = ${key} FOR UPDATE`;

      const next = nextStateAfterFailure(
        current && current.failures > 0 ? current : null,
        policy,
        now
      );
      await tx.loginThrottle.update({ where: { key }, data: next });
    });
  }

  await prisma.loginThrottle.deleteMany({
    where: { updatedAt: { lt: new Date(now.getTime() - STALE_MS) } },
  });
};

/** Remet à zéro les compteurs donnés (connexion réussie, mot de passe réinitialisé) */
export const clearLoginFailuresData = async (keys: string[]) => {
  if (keys.length === 0) return;
  await prisma.loginThrottle.deleteMany({ where: { key: { in: keys } } });
};
