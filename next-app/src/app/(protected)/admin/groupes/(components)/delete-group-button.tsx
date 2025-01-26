"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteGroup } from "@/hooks/mutations/group/use-delete-group";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteGroupButtonProps {
  id: string;
}

export default function DeleteGroupButton({ id }: DeleteGroupButtonProps) {
  const router = useRouter();
  const { mutateAsync: deleteGroup } = useDeleteGroup();

  const handleDelete = async () => {
    try {
      toast.promise(deleteGroup(id), {
        loading: "Suppression en cours...",
        success: (data) => data.success,
        error: (data) => data.error || "Une erreur c'est produite !",
      });
      router.push("/admin/groupes");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur c'est produite !");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"destructive"}>
          <Trash2 size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression du groupe</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sur de vouloirs supprimés, ce groupe ? Cette action est
            irréversible !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuller</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            className="w-fit"
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
