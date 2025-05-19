import { usePathname } from "next/navigation";

interface MenuItem {
  href?: string;
  submenus?: MenuItem[];
  [key: string]: any;
}

type PathParam = string | MenuItem[] | undefined;

/**
 * Fonction utilitaire pour vérifier si un chemin est actif (peut être utilisée de manière récursive)
 */
function checkPathActive(pathname: string, item: MenuItem): boolean {
  if (!item.href) return false;

  // Cas où le pathname est exactement égal au href
  if (pathname === item.href) return true;

  // Cas où le pathname commence par le href suivi d'un /
  if (pathname.startsWith(item.href + "/")) return true;

  // Vérification récursive des sous-menus
  if (item.submenus?.length) {
    return item.submenus.some(subItem => checkPathActive(pathname, subItem));
  }

  return false;
}

/**
 * Hook personnalisé pour vérifier si un chemin est actif
 * @param {PathParam} pathParam - Peut être :
 *   - Une chaîne représentant un href unique
 *   - Un tableau d'éléments de menu avec une propriété href
 *   - undefined
 * @returns {boolean} - true si le chemin actuel correspond au href ou à l'un des hrefs du menu
 */
export function useIsPathActive(pathParam?: PathParam): boolean {
  const pathname = usePathname();
  
  if (!pathname || !pathParam) return false;

  // Cas où on passe directement un href (string)
  if (typeof pathParam === 'string') {
    return pathname === pathParam || pathname.startsWith(`${pathParam}/`);
  }

  // Cas où on passe un tableau de MenuItem
  return pathParam.some(item => checkPathActive(pathname, item));
}
