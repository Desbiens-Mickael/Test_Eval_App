"use client";

import { Table } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Identifier } from "./data-table";

interface DataTAbleDEleteSElectionButtonProps<TData> {
  table: Table<TData>;
}

/**
 * Deletes selected rows from the table.
 *
 * @param {DataTAbleDEleteSElectionButtonProps<TData>} table - The table component with selected rows
 * @return {void}
 */
export default function DataTAbleDEleteSElectionButton<TData extends Identifier>({ table }: DataTAbleDEleteSElectionButtonProps<TData>) {
  const deleteSelectedRows = () => {
    table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)
      .map((id) => console.log(id));
  };
  return (
    <AnimatePresence>
      {table.getIsSomeRowsSelected() && (
        <motion.div initial={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0, transition: { duration: 0.2 } }} exit={{ opacity: 0, translateY: -10 }}>
          <Button title="Reinitialiser les filtres" variant="outline" className="h-8 w-8 p-0 border-none text-destructive hover:bg-destructive hover:text-white" onClick={() => deleteSelectedRows()}>
            <Trash2 />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
