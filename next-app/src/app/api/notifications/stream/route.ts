import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import { currentUser } from "@/lib/auth";
import { NotificationRecipient, subscribeToNotifications } from "@/lib/notification-hub";
import { createSharedTicker } from "@/lib/shared-ticker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Commentaire SSE envoyé régulièrement pour que les proxys gardent la connexion ouverte */
const HEARTBEAT_MS = 25_000;
/** Délai de reconnexion conseillé au navigateur après une coupure */
const RETRY_MS = 5_000;
/** Fréquence de clôture des contrôles échus tant que quelqu'un est connecté */
const CLOSURE_INTERVAL_MS = 60_000;

// Les contrôles échus sont clôturés à l'heure (et leurs élèves notifiés)
// dès qu'au moins un utilisateur est connecté, sans attendre qu'une page
// qui en dépend soit consultée. Conservé entre les rechargements à chaud.
const globalForTicker = globalThis as unknown as {
  controlClosureTicker?: ReturnType<typeof createSharedTicker>;
};
const closureTicker =
  globalForTicker.controlClosureTicker ??
  (globalForTicker.controlClosureTicker = createSharedTicker(
    closeExpiredControlsSafeData,
    CLOSURE_INTERVAL_MS
  ));

/**
 * Flux d'événements (Server-Sent Events) des notifications de l'utilisateur
 * connecté. L'événement `notification` ne contient rien : il invite le
 * navigateur à relire ses notifications.
 */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user?.id || (user.role !== "ADMIN" && user.role !== "STUDENT")) {
    return new Response("Non autorisé", { status: 401 });
  }
  const recipient: NotificationRecipient = {
    kind: user.role === "ADMIN" ? "teacher" : "student",
    id: user.id,
  };

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup(); // connexion déjà fermée
        }
      };

      const unsubscribe = subscribeToNotifications(recipient, () =>
        send("event: notification\ndata: {}\n\n")
      );
      const heartbeat = setInterval(() => send(": ping\n\n"), HEARTBEAT_MS);
      const releaseTicker = closureTicker.acquire();

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
        releaseTicker();
        cleanup = () => {};
      };

      request.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {
          // déjà fermé
        }
      });

      send(`retry: ${RETRY_MS}\n\n`);
      send("event: ready\ndata: {}\n\n");
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Désactive la mise en tampon des proxys (nginx, Traefik)
      "X-Accel-Buffering": "no",
    },
  });
}
