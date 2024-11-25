"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface DialogState {
  openId: string | null; // ID de l’élément ouvert
  setOpenId: (id: string | null) => void; // Fonction pour ouvrir/fermer le dialogue
}

interface DataTableRowActionsProps extends DialogState {
  elementId: string;
  editPath: string;
  handleDelete: (id: string) => Promise<void>;
}

export function DataTableRowActions({
  elementId,
  editPath,
  handleDelete,
  openId,
  setOpenId,
}: DataTableRowActionsProps) {
  const router = useRouter();

  const isOpen = openId === elementId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Options menu">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              router.push(editPath);
            }}
            aria-label="Modifier la sélection"
          >
            Modifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500 focus:bg-red-100 hover:bg-red-100 cursor-pointer w-full"
            onSelect={() => setOpenId(elementId)} // Ouvre uniquement pour cet élément
            aria-label="Supprimer la sélection"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isOpen} onOpenChange={(open) => !open && setOpenId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suppression de la ligne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cette ligne ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel aria-label="Annuler">Annuler</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                setOpenId(null);
                await handleDelete(elementId);
              }}
              aria-label="Supprimer"
            >
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
