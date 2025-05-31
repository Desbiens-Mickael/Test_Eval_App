"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import TableSkeleton from "@/components/table/table-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { DataTableRowActions } from "@/components/table/data-table-row-action";
import { useDeleteStudents } from "@/hooks/mutations/student/use-delete-students";
import {
  StudentResponse,
  useGetAllStudentsByProfessorId,
} from "@/hooks/queries/student/use-get-all-students-by-professorId ";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CreateStudentButton from "./create-student-button";
interface StudentTableProps extends StudentResponse {}

export default function StudentTable() {
  const { data: studentData, isLoading } = useGetAllStudentsByProfessorId();
  const { mutateAsync: mutateAsyncDelete, isPending } = useDeleteStudents();
  const [openId, setOpenId] = useState<string | null>(null);

  const router = useRouter();

  const handleDelete = useCallback(
    async (studentIds: string | string[]) => {
      if (!Array.isArray(studentIds)) studentIds = [studentIds];

      toast.promise(mutateAsyncDelete(studentIds), {
        loading: "Suppression en cours...",
        success: (data) => data.success,
        error: (data) =>
          data.error ||
          "Une erreur c'est produite pendant la suppression ! Veuillez réessayer.",
      });
    },
    [mutateAsyncDelete]
  );

  const columns: ColumnDef<StudentTableProps>[] = [
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
      cell: ({ row }) => {
        return row.original.groupStudent?.name ?? "Aucun groupe";
      },
    },

    {
      id: "Activé",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Activé" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return <>{isActive ? "Oui" : "Non"}</>;
      },
    },
    {
      id: "Date de création",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date de création" />
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return formatDate(date);
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
            openId={openId}
            setOpenId={setOpenId}
            showPath={`/admin/eleves/${row.original.id}`}
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
