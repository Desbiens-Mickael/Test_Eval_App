"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Card from "./card";
import useContentCardStore, {
  Column as ColumnType,
} from "./store/store-content-card";

interface ColumnProps {
  column: ColumnType;
  columnIndex: number;
  isEditing?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const Column = memo(({ column, columnIndex, isEditing }: ColumnProps) => {
  const [columnNameInput, setColumnNameInput] = useState(column.column);
  const [showInput, setShowInput] = useState(false);
  const { addCard, updateColumn, removeColumn } = useContentCardStore();

  // Mettre à jour le nom de la colonne
  const HandleupdateColumnName = useCallback(() => {
    const trimmedName = columnNameInput.trim();
    if (trimmedName && trimmedName !== column.column) {
      updateColumn(columnIndex, trimmedName);
    }
    setColumnNameInput(column.column);
    setShowInput(false);
  }, [columnIndex, column.column, columnNameInput, updateColumn]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setColumnNameInput(e.target.value);
    },
    []
  );

  // Mettre à jour le nom de la colonne en appuyant sur Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        HandleupdateColumnName();
      }
    },
    [HandleupdateColumnName]
  );

  // Mettre à jour le nom de la colonne en perdant le focus
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();
      HandleupdateColumnName();
    },
    [HandleupdateColumnName]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus sur l'input lors de l'édition
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "relative flex flex-col w-[280px] mx-auto md:w-full h-fit",
        "bg-card rounded-lg border border-border shadow-sm overflow-hidden",
        "transition-all duration-200 hover:shadow-md"
      )}
    >
      {/* En-tête de la colonne */}
      <div className="px-4 pt-3 pb-2 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          {!showInput ? (
            <div className="flex-1 flex items-center min-h-9">
              <h3
                onClick={() => isEditing && setShowInput(true)}
                className={cn(
                  "text-sm font-medium text-foreground line-clamp-2 break-words",
                  isEditing &&
                    "cursor-text hover:bg-accent/50 px-2 py-1 -mx-2 rounded"
                )}
              >
                {columnNameInput || "Sans titre"}
              </h3>
            </div>
          ) : (
            <div className="flex-1">
              <Input
                ref={inputRef}
                type="text"
                value={columnNameInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="h-9 text-sm"
                placeholder="Nom de la colonne"
              />
            </div>
          )}

          {isEditing && (
            <div className="flex items-center gap-1">
              {!showInput ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowInput(true)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Modifier le nom</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeColumn(columnIndex)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Supprimer la colonne</span>
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setShowInput(false);
                    setColumnNameInput(column.column);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Annuler</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Corps de la colonne */}
      <div className="p-2 space-y-2 flex-1 min-h-[100px] bg-muted/10">
        <AnimatePresence>
          {column.cards.map((card, index) => (
            <motion.div
              key={card.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Card
                isEditing={isEditing}
                columnIndex={columnIndex}
                cardIndex={card.id}
                contentCard={card.content}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pied de colonne */}
      {isEditing && (
        <div className="p-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => addCard(columnIndex, "")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une carte
          </Button>
        </div>
      )}
    </motion.div>
  );
});

Column.displayName = "Column";

export default Column;
