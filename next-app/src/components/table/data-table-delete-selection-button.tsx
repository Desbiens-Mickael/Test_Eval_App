"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Identifier } from "./data-table";

interface DataTableDeleteSelectionButtonProps<TData> {
  table: Table<TData>;
  handleDelete: (ids: string[]) => Promise<void>;
}

/**
 * Deletes selected rows from the table.
 *
 * @param {DataTableDeleteSelectionButtonProps<TData>} table - The table component with selected rows
 * @return {void}
 */
export default function DataTableDeleteSelectionButton<
  TData extends Identifier
>({ table, handleDelete }: DataTableDeleteSelectionButtonProps<TData>) {
  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  const hasSelectedRows =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const deleteSelectedRows = async () => {
    await handleDelete(selectedIds);
  };

  const textPluralOrSingular =
    selectedIds.length === 1 ? "cette ligne" : "ces lignes";

  return (
    <AnimatePresence>
      {hasSelectedRows && (
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, translateY: -10 }}
        >
          <AlertDialog>
            <AlertDialogTrigger
              className="h-8 w-8 p-0 border-none text-destructive hover:bg-destructive hover:text-white rounded-md"
              aria-label="Supprimer la sélection"
            >
              <Trash2 className="mx-auto" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Suppression de {textPluralOrSingular}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {`Voulez-vous vraiment supprimer ${textPluralOrSingular} ? Cette action est irréversible.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteSelectedRows();
                    table.resetRowSelection();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
