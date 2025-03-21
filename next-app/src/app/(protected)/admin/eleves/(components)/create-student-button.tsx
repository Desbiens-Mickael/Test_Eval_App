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
import { useCreateStudent } from "@/hooks/mutations/student/use-create-student";
import {
  registerStudentFormSchema,
  registerStudentFormType,
} from "@/shema-zod/auth.shema";
import { CreateGroupInput, createGroupSchema } from "@/shema-zod/group.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateStudentButton() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateStudent();

  const form = useForm<registerStudentFormType>({
    resolver: zodResolver(registerStudentFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
    },
  });

  const onSubmit = async (values: registerStudentFormType) => {
    try {
      toast.promise(mutateAsync(values), {
        loading: "Création en cours...",
        success: (data) => data.success,
        error: (data) => data.error || "Une erreur c'est produite !",
      });
      setOpen(false);
      form.reset();
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
        <Button size="sm" className="ml-auto hidden h-8 lg:flex">
          <Plus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Création d'un compte élève</AlertDialogTitle>
          <AlertDialogDescription>
            Entrer le nom et prénom de l'élève et cliquer sur confirmer
          </AlertDialogDescription>
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
              name="firstname"
              label="Prénom"
              placeholder="Prénom"
              description="Le prénom doit contenir au maximum de 20 caractères"
            />
            <CustomInput
              autoFocus
              isRequired
              control={form.control}
              name="lastname"
              label="Nom"
              placeholder="Nom"
              description="Le nom doit contenir au maximum de 20 caractères"
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
