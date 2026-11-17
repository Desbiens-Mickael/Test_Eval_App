"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const NOTIFICATION_STREAM_URL = "/api/notifications/stream";

/**
 * Écoute le flux temps réel des notifications : à chaque nouvelle
 * notification, la liste est relue. Après une coupure, le navigateur se
 * reconnecte seul ; la liste est alors relue pour rattraper ce qui a été
 * manqué pendant la coupure.
 */
export const useNotificationStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof EventSource === "undefined") return;

    const source = new EventSource(NOTIFICATION_STREAM_URL);
    let hasConnected = false;
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

    source.addEventListener("notification", refresh);
    source.addEventListener("ready", () => {
      if (hasConnected) refresh();
      hasConnected = true;
    });

    return () => source.close();
  }, [queryClient]);
};
