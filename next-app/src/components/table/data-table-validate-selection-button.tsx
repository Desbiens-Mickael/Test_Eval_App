"use client";

import { Table } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Identifier } from "./data-table";

interface DataTableValidateSelectionButtonProps<TData> {
  table: Table<TData>;
  handleValidate: (ids: string[]) => Promise<void>;
}

export default function DataTableValidateSelectionButton<
  TData extends Identifier
>({ table, handleValidate }: DataTableValidateSelectionButtonProps<TData>) {
  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  const hasSelectedRows =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const validateSelectedRows = async () => {
    await handleValidate(selectedIds);
  };

  return (
    <AnimatePresence>
      {hasSelectedRows && (
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, translateY: -10 }}
        >
          <Button
            onClick={async () => {
              await validateSelectedRows();
              table.resetRowSelection();
            }}
            className="bg-primary text-primary-foreground w-fit"
          >
            Valider
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
