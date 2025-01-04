"use client";

import CustomInput from "@/components/form/custom-input";
import SubmitButton from "@/components/form/submit-button";
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
import { Form } from "@/components/ui/form";
import { useCreateGroup } from "@/hooks/mutations/group/use-create-group";
import { CreateGroupInput, createGroupSchema } from "@/shema-zod/group.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateGroupButton() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateGroup();

  const form = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: CreateGroupInput) => {
    try {
      const res = await mutateAsync(values);
      if (res.error) toast.error(res.error);
      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur c'est produite !");
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"icon"}>
          <Plus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Entrez le nom du groupe</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            id="create-group"
          >
            <CustomInput
              autoFocus
              isRequired
              control={form.control}
              name="name"
              label="Nom du groupe"
              placeholder="Nom du groupe"
              description="Le nom du groupe doit contenir au maximum de 20 caractères"
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose()}>
            Annuller
          </AlertDialogCancel>
          <SubmitButton
            form="create-group"
            isLoading={isPending}
            texte="Confirmer"
            loadindText="Création..."
            className="w-fit"
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
