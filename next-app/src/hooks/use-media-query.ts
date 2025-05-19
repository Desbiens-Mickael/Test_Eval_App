import { useEffect, useState } from "react";

/**
 * Hook personnalisé qui détecte si la requête média spécifiée correspond à la fenêtre actuelle
 * @param {string} query - La requête média à évaluer (ex: '(min-width: 768px)')
 * @returns {boolean} Retourne `true` si la requête média correspond, `false` sinon
 * 
 * @example
 * // Utilisation de base
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Utilisation avec plusieurs conditions
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}
