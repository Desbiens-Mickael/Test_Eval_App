"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { memo, useCallback, useState } from "react";
import Card from "./card";
import useContentCardStore, {
  Column as ColumnType,
} from "./store/store-content-card";

interface ColumnProps {
  column: ColumnType;
  columnIndex: number;
  isEditing?: boolean;
}

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

  return (
    <div
      key={columnIndex}
      className="relative flex flex-col w-[200px] h-fit bg-foreground rounded-lg overflow-hidden p-2"
    >
      <div className="w-full">
        {!showInput ? (
          <div className="flex justify-between">
            <h3
              onClick={() => setShowInput(true)}
              className="text-md text-white ms-1 cursor-pointer"
            >
              {columnNameInput}
            </h3>
            {isEditing && (
              <Button
                type="button"
                className="size-fit p-1 ms-2 text-slate-400 bg-transparent hover:bg-transparent hover:text-destructive focus:text-destructive"
                onClick={() => removeColumn(columnIndex)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ) : (
          <Input
            type="text"
            value={columnNameInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        )}
      </div>
      <div className="min-h-[80px] flex flex-col py-2 gap-2">
        {column.cards.map((card) => (
          <Card
            isEditing={isEditing}
            key={card.id}
            columnIndex={columnIndex}
            cardIndex={card.id}
            contentCard={card.content}
          />
        ))}
      </div>
      {isEditing && (
        <button
          type="button"
          className="w-full text-sm text-white text-start rounded-md hover:bg-slate-600 transition-colors duration-200 ease-in-out"
          onClick={() => addCard(columnIndex, "")}
        >
          <span className="mx-2 text-lg text-zinc-300">+</span> Ajouter une
          carte
        </button>
      )}
    </div>
  );
});

Column.displayName = "Column";

export default Column;
