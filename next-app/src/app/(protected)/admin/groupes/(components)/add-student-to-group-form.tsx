"use client";

import CustomSelect from "@/components/form/custom-select";
import SubmitButton from "@/components/form/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Form } from "@/components/ui/form";
import { useAddStudentToGroup } from "@/hooks/mutations/group/use-add-student-to-group";
import { useGetAllStudentsByAuthorIdwhoDontBelongToTheGroupId } from "@/hooks/queries/student/use-get-all-students-by-professorId-who-dont-belong-to-the-groupId";
import {
  AddUserToGroupInput,
  addUserToGroupSchema,
} from "@/shema-zod/group.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareWarning, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AddToGroupSkeleton from "./add-to-group-skeleton";

interface AddUserToGroupFormProps {
  groupId: string;
}

export default function AddStudentToGroupForm({
  groupId,
}: AddUserToGroupFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddUserToGroupInput>({
    resolver: zodResolver(addUserToGroupSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const { data, isLoading: isLoadingStudents } =
    useGetAllStudentsByAuthorIdwhoDontBelongToTheGroupId(groupId);
  const { mutateAsync, isPending } = useAddStudentToGroup();

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

  if (isLoadingStudents) {
    return <AddToGroupSkeleton className="self-center" />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 self-center"
        >
          <Plus className="h-4 w-4" />
          Ajouter un élève
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un élève au groupe</DialogTitle>
          <DialogDescription>
            Séléctionner l'élève à ajouter dans la dans la liste ci-dessous.
          </DialogDescription>
        </DialogHeader>
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
                  label: student.name,
                }))}
                name="identifier"
                label="Nom de l'élève"
                placeholder="Séléctionner l'élève"
                description="L'élève à ajouter au groupe"
              />
            </div>
          </form>
          <Alert variant="warning">
            <MessageSquareWarning className="h-4 w-4" color="#ffffa1" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Si l'élève est déjà dans un groupe, il sera déplacé dans ce
              groupe-ci.
            </AlertDescription>
          </Alert>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                form.reset();
              }}
            >
              Annuler
            </Button>
          </DialogClose>
          <SubmitButton
            form="create-group"
            isLoading={isPending}
            texte="Confirmer"
            loadindText="Ajout en cours..."
            className="w-fit"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
