"use client";

import CustomSelect from "@/components/form/custom-select";
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
import { useAddStudentToGroup } from "@/hooks/mutations/group/use-add-student-to-group";
import { useGetAllStudentsByProfessorId } from "@/hooks/queries/student/use-get-all-students-by-professorId";
import {
  AddUserToGroupInput,
  addUserToGroupSchema,
} from "@/shema-zod/group.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddUserToGroupFormProps {
  authorId: string;
  groupId: string;
}

export default function AddStudentToGroupForm({
  authorId,
  groupId,
}: AddUserToGroupFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddUserToGroupInput>({
    resolver: zodResolver(addUserToGroupSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const { data } = useGetAllStudentsByProfessorId(authorId, groupId);
  const { mutateAsync, isPending } = useAddStudentToGroup();

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = async (values: AddUserToGroupInput) => {
    try {
      toast.promise(
        mutateAsync({
          groupId,
          identifier: values.identifier,
        }),
        {
          loading: "Ajout de l'éleve en cours...",
          success: (data) => data.success,
          error: (data) => data.error || "Une erreur c'est produite !",
        }
      );
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur c'est produite !");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} className="self-end">
          <Plus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter un élève au groupe</AlertDialogTitle>
          <AlertDialogDescription>
            Séléctionner l'élève à ajouter dans la dans la liste ci-dessous.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            id="create-group"
          >
            <div className="flex flex-col gap-4">
              <CustomSelect
                control={form.control}
                options={data?.map((student) => ({
                  id: student.identifier,
                  label: student.firstName + " " + student.lastName,
                }))}
                name="identifier"
                label="Nom de l'élève"
                placeholder="Séléctionner l'élève"
                description="L'élève à ajouter au groupe"
              />
            </div>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose()}>
            Anuller
          </AlertDialogCancel>
          <SubmitButton
            form="create-group"
            isLoading={isPending}
            texte="Confirmer"
            loadindText="Ajout en cours..."
            className="w-fit"
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
