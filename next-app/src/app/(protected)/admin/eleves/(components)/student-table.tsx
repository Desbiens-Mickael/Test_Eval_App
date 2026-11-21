"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import TableSkeleton from "@/components/table/table-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTableRowActions } from "@/components/table/data-table-row-action";
import { useDeleteStudents } from "@/hooks/mutations/student/use-delete-students";
import {
  StudentRow,
  useGetStudentsPage,
} from "@/hooks/queries/student/use-get-students-page";
import { useServerTable } from "@/hooks/use-server-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/empty-state";
import { FileUp, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountStatusBadge from "./account-status-badge";
import CreateStudentButton from "./create-student-button";

export default function StudentTable() {
  const { query, alignPage, tableOptions } = useServerTable({ searchColumnId: "Nom" });
  const { data: studentPage, isLoading, isError, error } = useGetStudentsPage(query);
  useEffect(() => alignPage(studentPage?.page), [alignPage, studentPage?.page]);
  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError, error]);
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

  const columns: ColumnDef<StudentRow>[] = [
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
      id: "Compte",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Compte" />
      ),
      cell: ({ row }) => (
        <AccountStatusBadge
          isActive={row.original.isActive}
          disabledAt={row.original.disabledAt}
        />
      ),
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
      data={studentPage?.items ?? []}
      server={{ ...tableOptions, rowCount: studentPage?.total ?? 0 }}
      viewOptionsButton
      inputSearchColumnId="Nom"
      handleDelete={handleDelete}
      emptyState={
        <EmptyState
          icon={UserPlus}
          title="Aucun élève pour l'instant"
          description="Créez les comptes de vos élèves un par un, ou importez une liste (CSV, Excel ou copier-coller). Chaque élève reçoit un identifiant et un mot de passe ; avec l'e-mail d'un parent, son accès est créé et lui est envoyé."
        >
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/eleves/import">
              <FileUp className="mr-2 h-4 w-4" aria-hidden="true" />
              Importer une liste
            </Link>
          </Button>
          <CreateStudentButton label="Créer un élève" />
        </EmptyState>
      }
      createChildren={
        <>
          <Button asChild size="sm" variant="outline" className="ml-auto h-8">
            <Link href="/admin/eleves/import">
              <FileUp className="mr-2 h-4 w-4" aria-hidden="true" />
              Importer
            </Link>
          </Button>
          <CreateStudentButton />
        </>
      }
    >
      {/* {(table) => [<FilterGRadeLevel table={table} />]} */}
    </DataTable>
  );
}
