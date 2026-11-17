"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListPaginationProps {
  /** Page courante, à partir de 1 */
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Nom des éléments au pluriel, pour le lecteur d'écran (ex. « copies ») */
  itemsLabel: string;
  disabled?: boolean;
}

/** Pagination simple (précédent / suivant) pour les listes en cartes */
export default function ListPagination({
  page,
  pageCount,
  total,
  onPageChange,
  itemsLabel,
  disabled,
}: ListPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={`Pagination des ${itemsLabel}`}
      className="flex flex-wrap items-center justify-center gap-4"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
        Précédent
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Page <span className="font-medium text-foreground">{page}</span> sur {pageCount}
        <span className="sr-only">
          {" "}
          ({total} {itemsLabel})
        </span>
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= pageCount}
      >
        Suivant
        <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
