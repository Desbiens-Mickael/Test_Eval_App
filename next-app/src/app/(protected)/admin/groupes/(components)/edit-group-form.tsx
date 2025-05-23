"use client";

import Loader from "@/components/loader";
import { useGetGroupById } from "@/hooks/queries/group/use-get-group-by-id";
import { toast } from "sonner";
import AddLessonToGroup from "./add-lesson-to-group-form";
import AddStudentToGroupForm from "./add-student-to-group-form";
import DeleteGroupButton from "./delete-group-button";
import LessonListe from "./lesson-liste";
import ListeMembers from "./liste-members";

interface EditGroupFormProps {
  id: string;
}

export default function EditGroupForm({ id }: EditGroupFormProps) {
  const { data, isLoading, isError, error } = useGetGroupById(id);

  if (isLoading || !data) {
    // TODO: Ajouter le skeleton du formulaire
    return <Loader />;
  }

  if (isError) {
    return toast.error(error?.message);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-end">
        <DeleteGroupButton id={id} />
      </div>
      <div className="w-full flex flex-col space-y-10">
        <form className="w-full flex flex-col space-y-4">
          <fieldset className="w-full flex border-2 border-dashed border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-bold">
              Informations du groupe
            </legend>
            <h3>{data.name}</h3>
          </fieldset>
        </form>
        <div className="w-full flex flex-col border-2 border-dashed border-gray-300 rounded-lg p-4 relative">
          <h3 className="text-lg font-bold absolute top-[-15px] bg-white">
            Gestion des élèves
          </h3>
          <AddStudentToGroupForm groupId={id} />
          <ListeMembers students={data.students} />
        </div>
        <div className="w-full flex flex-col border-2 border-dashed border-gray-300 rounded-lg p-4 relative">
          <h3 className="text-lg font-bold absolute top-[-15px] bg-white">
            Gestion des Leçons
          </h3>
          <AddLessonToGroup groupId={id} />
          <LessonListe lessons={data.lessons} groupId={id} />
        </div>
      </div>
    </div>
  );
}
