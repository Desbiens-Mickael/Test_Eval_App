"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { columnInput } from "@/shema-zod/exercice.shema";
import { useEffect, useState } from "react";
import Column from "./column";
import useContentCardStore, {
  Column as ColumnType,
} from "./store/store-content-card";

export interface ContentCardProps {
  onChange?: (newContent: ColumnType[]) => void;
  initialValue?: columnInput[];
  isEditing?: boolean;
}

export default function ContentCardForm({
  onChange,
  initialValue,
  isEditing = true,
}: ContentCardProps) {
  const { columns, setInitialValues, addColumn } = useContentCardStore();
  const [inputColumn, setInputColumn] = useState("");

  // Initialiser Zustand avec `initialValue` et `onChange`
  useEffect(() => {
    const defaultValue = initialValue || [];
    setInitialValues(defaultValue, onChange);

    return () => {
      setInitialValues([]);
    };
  }, [initialValue, onChange, setInitialValues]);

  const handleAddColumn = () => {
    if (inputColumn === "") return;
    addColumn(inputColumn);
    setInputColumn("");
  };

  return (
    <div className="flex flex-col gap-4">
      {isEditing && (
        <div className="w-full flex justify-center items-end gap-2">
          <div className="flex flex-col">
            <Label className="mb-1" htmlFor="add-column">
              Ajouter une colonne
            </Label>
            <Input
              id="add-column"
              type="text"
              onChange={(e) => setInputColumn(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddColumn();
                }
              }}
              value={inputColumn}
              placeholder="Nom de la colonne"
              className="w-fit"
            />
          </div>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => handleAddColumn()}
          >
            Ajouter
          </Button>
        </div>
      )}
      <div className="flex gap-4">
        {columns.map((column, columnIndex) => (
          <Column
            isEditing={isEditing}
            key={column.column}
            column={column}
            columnIndex={columnIndex}
          />
        ))}
      </div>
    </div>
  );
}
