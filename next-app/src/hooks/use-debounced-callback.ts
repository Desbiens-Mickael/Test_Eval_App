import { useCallback, useEffect, useRef } from "react";

type Timer = ReturnType<typeof setTimeout>;

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  // Garder une référence au timer
  const timerRef = useRef<Timer>();

  // Garder une référence stable à la callback
  const callbackRef = useRef(callback);

  // Mettre à jour la référence de la callback quand elle change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Nettoyer le timer quand le composant est démonté
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      // Annuler le timer précédent
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Créer un nouveau timer
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
