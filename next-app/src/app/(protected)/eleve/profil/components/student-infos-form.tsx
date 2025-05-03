"use client";

import SubmitButton from "@/components/form/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateStudentInfos } from "@/hooks/mutations/student/use-update-student-infos";
import {
  studentInfosFormSchema,
  studentInfosFormType,
} from "@/shema-zod/auth.shema";
import { StudentInfos } from "@/type/student";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface StudentInfosFormProps {
  student: StudentInfos;
}

export default function StudentInfosForm({ student }: StudentInfosFormProps) {
  const name = student.name.split(" ");
  const form = useForm<studentInfosFormType>({
    resolver: zodResolver(studentInfosFormSchema),
    defaultValues: {
      firstname: name[0],
      lastname: name[1],
    },
  });

  const { mutateAsync, isPending } = useUpdateStudentInfos();

  const onSubmit = async (values: studentInfosFormType) => {
    await mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          name="identifier"
          render={() => (
            <FormItem>
              <FormLabel>Identifiant</FormLabel>
              <FormControl>
                <Input
                  value={student.identifier}
                  readOnly
                  className="bg-gray-100 text-gray-600"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton
          texte="Enregistrer"
          isLoading={isPending}
          loadindText=" Modification en cours..."
          className="self-end"
        />
      </form>
    </Form>
  );
}
