// store.js
import { stringToSlug } from "@/lib/utils";
import { cardItemInput } from "@/shema-zod/exercice.shema";
import { toast } from "sonner";
import { create } from "zustand";

export interface Column {
  column: string;
  cards: cardItemInput[];
}

interface Store {
  columns: Column[];
  onChange: ((columns: Column[]) => void) | null;
  setInitialValues: (
    initialValues: Column[],
    onChange?: (columns: Column[]) => void
  ) => void;
  addColumn: (column: string) => void;
  updateColumn: (columnIndex: number, newValue: string) => void;
  removeColumn: (columnIndex: number) => void;
  addCard: (columnIndex: number, card: string) => void;
  updateCard: (
    columnIndex: number,
    cardIndex: string,
    newValue: string
  ) => void;
  removeCard: (columnIndex: number, cardIndex: string) => void;
}

const useContentCardStore = create<Store>((set, get) => ({
  columns: [],
  onChange: null,

  setInitialValues: (initialValues, onChange) => {
    set({ columns: initialValues, onChange });
  },

  addColumn: (column) => {
    const { columns, onChange } = get();

    // Vérification de l'absence de noms de colonnes en double
    if (
      columns.some(
        (col) => col.column.trim().toLowerCase() === column.trim().toLowerCase()
      )
    ) {
      toast.error("Une colonne avec ce nom existe déjà.");
      return;
    }

    const newColumns = [...columns, { column: column.trim(), cards: [] }];
    set({ columns: newColumns });
    onChange?.(newColumns);
  },

  updateColumn: (columnIndex, newValue) => {
    const { columns, onChange } = get();

    // Vérification de l'index de la colonne
    if (columnIndex < 0 || columnIndex >= columns.length) {
      toast.error("Index de colonne invalide.");
      return;
    }

    // Vérification de l'absence de noms de colonnes en double
    if (
      columns.some(
        (col, index) =>
          index !== columnIndex &&
          col.column.trim().toLowerCase() === newValue.trim().toLowerCase()
      )
    ) {
      toast.error("Une colonne avec ce nom existe déjà.");
      return;
    }

    const updatedColumns = columns.map((col, index) =>
      index === columnIndex ? { ...col, column: newValue.trim() } : col
    );

    set({ columns: updatedColumns });
    onChange?.(updatedColumns);
  },

  removeColumn: (columnIndex) => {
    const { columns, onChange } = get();

    // Vérification de l'index de la colonne
    if (columnIndex < 0 || columnIndex >= columns.length) {
      toast.error("Index de colonne invalide.");
      return;
    }

    const updatedColumns = columns.filter((_, index) => index !== columnIndex);
    set({ columns: updatedColumns });
    onChange?.(updatedColumns);
  },

  addCard: (columnIndex, card) => {
    const { columns, onChange } = get();

    // Vérification de l'index de la colonne
    if (columnIndex < 0 || columnIndex >= columns.length) {
      toast.error("Index de colonne invalide.");
      return;
    }

    // Vérification de l'absence de cartes vides
    if (columns[columnIndex].cards.includes({ id: "", content: "" })) {
      toast.error(
        "Veuillez remplir toutes les cartes existantes dans la colonne avant d'ajouter une nouvelle."
      );
      return;
    }

    const updatedColumns = columns.map((col, idx) => {
      if (idx === columnIndex) {
        const columnNameFormated = stringToSlug(col.column);

        const cardId = `${columnNameFormated}-${col.cards.length}`;
        return {
          ...col,
          cards: [...col.cards, { id: cardId, content: card.trim() }],
        };
      } else {
        return col;
      }
    });

    set({ columns: updatedColumns });
    onChange?.(updatedColumns);
  },

  updateCard: (columnIndex, cardIndex, newValue) => {
    const { columns, onChange } = get();

    // Vérification de l'index de la colonne
    if (columnIndex < 0 || columnIndex >= columns.length) {
      toast.error("Index de colonne invalide.");
      return;
    }

    const column = columns[columnIndex];
    if (cardIndex === "" || cardIndex === undefined) {
      toast.error("Index de carte invalide.");
      return;
    }

    const trimmedValue = newValue.trim();
    let updatedColumns;
    // Vérification de l'absence de cartes en double dans la même colonne
    if (
      column.cards.some(
        (card) =>
          card.id !== cardIndex &&
          card.content.trim().toLowerCase() === trimmedValue.toLowerCase()
      )
    ) {
      toast.error("Une carte avec cette valeur existe déjà dans la colonne.");
      updatedColumns = columns.map((col, index) =>
        index === columnIndex
          ? {
              ...col,
              cards: col.cards.filter((card) => card.id !== cardIndex),
            }
          : col
      );
    } else {
      updatedColumns = columns.map((col, index) =>
        index === columnIndex
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardIndex
                  ? { ...card, content: trimmedValue }
                  : card
              ),
            }
          : col
      );
    }

    set({ columns: updatedColumns });
    onChange?.(updatedColumns);
  },

  removeCard: (columnIndex, cardIndex) => {
    const { columns, onChange } = get();

    // Vérification de l'index de la colonne
    if (columnIndex < 0 || columnIndex >= columns.length) {
      toast.error("Index de colonne invalide.");
      return;
    }
    const column = columns[columnIndex];

    if (cardIndex === "" || cardIndex === undefined) {
      toast.error("Index de carte invalide.");
      return;
    }

    const updatedColumns = columns.map((col, index) =>
      index === columnIndex
        ? {
            ...col,
            cards: col.cards.filter((card) => card.id !== cardIndex),
          }
        : col
    );

    set({ columns: updatedColumns });
    onChange?.(updatedColumns);
  },
}));

export default useContentCardStore;
