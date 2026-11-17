"use client";

import { PageQueryInput } from "@/shema-zod/pagination.shema";
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

/** Délai avant d'envoyer la recherche au serveur, le temps de finir la saisie */
const SEARCH_DELAY_MS = 300;

/**
 * État d'un tableau paginé côté serveur : page, tri et filtres sont pilotés
 * par le tableau, puis traduits en paramètres pour l'action serveur.
 * Changer de tri ou de filtre revient à la première page.
 */
export function useServerTable({
  searchColumnId,
  pageSize = 10,
}: {
  /** Colonne dont le filtre texte sert de recherche */
  searchColumnId?: string;
  pageSize?: number;
} = {}) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const toFirstPage = useCallback(() => setPagination((p) => ({ ...p, pageIndex: 0 })), []);

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      setSorting(updater);
      toFirstPage();
    },
    [toFirstPage]
  );

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      setColumnFilters(updater);
      toFirstPage();
    },
    [toFirstPage]
  );

  const searchValue = columnFilters.find((f) => f.id === searchColumnId)?.value;
  const search = useDebouncedValue(typeof searchValue === "string" ? searchValue : "", SEARCH_DELAY_MS);

  const query: PageQueryInput = useMemo(() => {
    const filters = Object.fromEntries(
      columnFilters
        .filter((f) => f.id !== searchColumnId && Array.isArray(f.value) && f.value.length > 0)
        .map((f) => [f.id, f.value as string[]])
    );
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: search || undefined,
      sort: sorting[0] ? { id: sorting[0].id, desc: sorting[0].desc } : undefined,
      filters: Object.keys(filters).length ? filters : undefined,
    };
  }, [columnFilters, pagination, search, searchColumnId, sorting]);

  /** Le serveur ramène une page trop loin à la dernière : on s'aligne dessus */
  const alignPage = useCallback((serverPage: number | undefined) => {
    if (!serverPage) return;
    setPagination((p) => (p.pageIndex === serverPage - 1 ? p : { ...p, pageIndex: serverPage - 1 }));
  }, []);

  return {
    query,
    alignPage,
    tableOptions: {
      state: { pagination, sorting, columnFilters },
      onPaginationChange: setPagination,
      onSortingChange,
      onColumnFiltersChange,
    },
  };
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
