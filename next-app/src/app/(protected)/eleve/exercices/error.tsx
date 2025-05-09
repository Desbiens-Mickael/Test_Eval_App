"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur capturée :", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-destructive">
        Oups ! Une erreur est survenue 😵
      </h2>
      <p className="text-center">{error.message}</p>
      <Button className="mt-4" variant="outline" onClick={() => reset()}>
        Réessayer
      </Button>
    </div>
  );
}
