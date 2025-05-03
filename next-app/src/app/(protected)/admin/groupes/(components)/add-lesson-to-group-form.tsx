"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import GroupLessonManagementTable from "./group-lesson-management-table";

interface AddLessonToGroupProps {
  groupId: string;
}

export default function AddLessonToGroup({ groupId }: AddLessonToGroupProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 self-center"
        >
          <Plus className="h-4 w-4" />
          Ajouter une leçon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Ajouter une leçon</DialogTitle>
          <DialogDescription>Ajoutez une leçon au groupe</DialogDescription>
        </DialogHeader>
        <GroupLessonManagementTable groupId={groupId} setOpen={setOpen} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => {}}>
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
