import { EventEmitter } from "events";

/**
 * Relais des nouvelles notifications vers les navigateurs connectés
 * (flux SSE `/api/notifications/stream`).
 *
 * Le relais vit dans le processus Node : il suffit tant que l'application
 * tourne en un seul exemplaire (cas actuel, en dev comme en prod). Avec
 * plusieurs instances, il faudrait le remplacer par un relais partagé
 * (LISTEN/NOTIFY de Postgres, Redis…).
 *
 * Aucun contenu n'est transmis : le navigateur est seulement prévenu qu'il
 * a du nouveau, puis relit ses notifications par l'action serveur habituelle,
 * qui vérifie la session.
 */

export type NotificationRecipient = { kind: "teacher" | "student"; id: string };

const channel = ({ kind, id }: NotificationRecipient) => `${kind}:${id}`;

// Conservé entre les rechargements à chaud du serveur de développement
const globalForHub = globalThis as unknown as { notificationHub?: EventEmitter };
const hub =
  globalForHub.notificationHub ??
  (globalForHub.notificationHub = new EventEmitter().setMaxListeners(0));

/** Prévient les destinataires connectés qu'ils ont une nouvelle notification */
export const publishNotification = (recipients: NotificationRecipient[]) => {
  recipients.forEach((recipient) => hub.emit(channel(recipient)));
};

/** Écoute les nouvelles notifications d'un destinataire ; renvoie la fonction de désabonnement */
export const subscribeToNotifications = (
  recipient: NotificationRecipient,
  listener: () => void
) => {
  hub.on(channel(recipient), listener);
  return () => {
    hub.off(channel(recipient), listener);
  };
};

/** Nombre d'abonnements ouverts pour un destinataire (tests, diagnostic) */
export const listenerCount = (recipient: NotificationRecipient) =>
  hub.listenerCount(channel(recipient));
