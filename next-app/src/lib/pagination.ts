import { PageQueryInput, pageQuerySchema } from "@/shema-zod/pagination.shema";
import { Page, PageQuery } from "@/type/pagination";

/** Valide les paramètres reçus du client ; lève une erreur s'ils sont invalides */
export const parsePageQuery = (input: PageQueryInput = {}): PageQuery =>
  pageQuerySchema.parse(input);

/**
 * Compte puis charge une seule page. Une page au-delà de la dernière
 * (après une suppression, par exemple) est ramenée à la dernière page.
 */
export const paginate = async <T>(
  query: Pick<PageQuery, "page" | "pageSize">,
  count: () => Promise<number>,
  find: (args: { skip: number; take: number }) => Promise<T[]>
): Promise<Page<T>> => {
  const total = await count();
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, pageCount);
  const items = total > 0 ? await find({ skip: (page - 1) * query.pageSize, take: query.pageSize }) : [];
  return { items, total, page, pageSize: query.pageSize, pageCount };
};

/**
 * Traduit le tri demandé en `orderBy` Prisma. Seules les colonnes prévues
 * sont triables ; l'identifiant départage les égalités pour que les pages
 * restent stables.
 */
export const orderByFrom = <TOrderBy extends object>(
  sort: PageQuery["sort"],
  columns: Record<string, (direction: "asc" | "desc") => TOrderBy>,
  fallback: TOrderBy
): TOrderBy[] => {
  const toOrderBy = sort ? columns[sort.id] : undefined;
  const primary = toOrderBy ? toOrderBy(sort?.desc ? "desc" : "asc") : fallback;
  return [primary, { id: "asc" } as TOrderBy];
};

/** Compte, pour chaque valeur d'un filtre, le nombre d'éléments correspondants */
export const facetCounts = async (
  values: string[],
  count: (value: string) => Promise<number>
): Promise<Record<string, number>> => {
  const counts = await Promise.all(values.map(count));
  return Object.fromEntries(values.map((value, i) => [value, counts[i]]));
};

/** Valeurs sélectionnées pour un filtre, ou `undefined` si aucune */
export const filterValues = (query: PageQuery, columnId: string) => {
  const values = query.filters?.[columnId];
  return values && values.length > 0 ? values : undefined;
};
