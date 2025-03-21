"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import TableSkeleton from "@/components/table/table-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteLessons } from "@/hooks/mutations/lesson/use-delete-lesson";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { DataTableRowActions } from "@/components/table/data-table-row-action";
import { useGetAllStudentsByProfessorId } from "@/hooks/queries/student/use-get-all-students-by-professorId ";
import { Student } from "@/type/student";
import { useRouter } from "next/navigation";
import CreateStudentButton from "./create-student-button";

export default function StudentTable({ subject }: { subject: string }) {
  const { data: studentData, isLoading } = useGetAllStudentsByProfessorId();
  const { mutateAsync: mutateAsyncDelete, isPending } = useDeleteLessons();
  const [openId, setOpenId] = useState<string | null>(null);

  const router = useRouter();

  const handleDelete = useCallback(
    async (lessonIds: string | string[]) => {
      if (!Array.isArray(lessonIds)) lessonIds = [lessonIds];

      toast.promise(mutateAsyncDelete(lessonIds), {
        loading: "Suppression en cours...",
        success: (data) => data.success,
        error: (data) =>
          data.error ||
          "Une erreur c'est produite pendant la suppression ! Veuillez réessayer.",
      });
    },
    [mutateAsyncDelete]
  );

  const columns: ColumnDef<Student>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "Nom",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nom" />
      ),
    },
    {
      id: "Identifiant",
      accessorKey: "identifier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Identifiant" />
      ),
    },
    {
      id: "Groupe",
      accessorKey: "groupStudent.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Groupe" />
      ),
    },

    {
      id: "Activé",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Activé" />
      ),
    },
    {
      id: "Date de création",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date de création" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt); // Convertir en objet Date
        return date.toLocaleDateString("fr-FR", {
          // Formater la date
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DataTableRowActions
            elementId={row.original.id}
            handleDelete={handleDelete}
            editPath={`/admin/eleves/${row.original.id}/edition`}
            openId={openId}
            setOpenId={setOpenId}
          />
        );
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <DataTable
      columns={columns}
      data={studentData ?? []}
      viewOptionsButton
      inputSearchColumnId="Nom"
      handleDelete={handleDelete}
      createChildren={<CreateStudentButton />}
    >
      {/* {(table) => [<FilterGRadeLevel table={table} />]} */}
    </DataTable>
  );
}
