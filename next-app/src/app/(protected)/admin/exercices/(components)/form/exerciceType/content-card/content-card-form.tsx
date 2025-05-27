"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { columnInput } from "@/shema-zod/exercice.shema";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, PlusCircle } from "lucide-react";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function ContentCardForm({
  onChange,
  initialValue,
  isEditing = true,
}: ContentCardProps) {
  const { columns, setInitialValues, addColumn } = useContentCardStore();
  const [inputColumn, setInputColumn] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialiser Zustand avec `initialValue` et `onChange`
  useEffect(() => {
    const defaultValue = initialValue || [];
    setInitialValues(defaultValue, onChange);

    // Forcer un re-render après le montage pour déclencher les animations
    const timer = setTimeout(() => setIsMounted(true), 100);

    return () => {
      setInitialValues([]);
      setIsMounted(false);
      clearTimeout(timer);
    };
  }, [initialValue, onChange, setInitialValues]);

  const handleAddColumn = () => {
    if (inputColumn.trim() === "") return;
    addColumn(inputColumn.trim());
    setInputColumn("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <AnimatePresence>
        {isEditing && (
          <motion.div
            layout
            className="w-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {!isAdding ? (
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsAdding(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter une colonne
              </Button>
            ) : (
              <motion.div
                className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex-1">
                  <Label htmlFor="add-column" className="sr-only">
                    Nom de la colonne
                  </Label>
                  <Input
                    id="add-column"
                    type="text"
                    autoFocus
                    onChange={(e) => setInputColumn(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddColumn();
                      } else if (e.key === "Escape") {
                        setIsAdding(false);
                        setInputColumn("");
                      }
                    }}
                    value={inputColumn}
                    placeholder="Saisir le nom de la colonne..."
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setInputColumn("");
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddColumn}
                    disabled={!inputColumn.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {columns.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate={isMounted ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
        >
          <AnimatePresence>
            {columns.map((column, columnIndex) => (
              <motion.div
                key={column.column}
                variants={item}
                custom={columnIndex} // Passe l'index comme argument à la variante
                layout
                initial="hidden"
                animate={isMounted ? "show" : "hidden"}
              >
                <Column
                  isEditing={isEditing}
                  column={column}
                  columnIndex={columnIndex}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed bg-muted/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <PlusCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-foreground">
            Aucune colonne
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez par ajouter votre première colonne
          </p>
          {isEditing && !isAdding && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une colonne
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
