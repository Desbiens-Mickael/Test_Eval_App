/** Paramètres d'une liste paginée côté serveur */
export type PageQuery = {
  /** Numéro de page, à partir de 1 */
  page: number;
  pageSize: number;
  /** Recherche libre (nom, titre…) */
  search?: string;
  /** Tri : identifiant de colonne du tableau */
  sort?: { id: string; desc: boolean };
  /** Filtres à choix multiples, par identifiant de colonne */
  filters?: Record<string, string[]>;
};

/** Une page de résultats */
export type Page<T> = {
  items: T[];
  /** Nombre total d'éléments correspondant aux filtres */
  total: number;
  /** Page réellement renvoyée (ramenée à la dernière page si besoin) */
  page: number;
  pageSize: number;
  pageCount: number;
  /** Nombre d'éléments par valeur de filtre, par colonne */
  facets?: Record<string, Record<string, number>>;
};
