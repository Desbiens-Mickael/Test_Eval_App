"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetGroupById } from "@/hooks/queries/group/use-get-group-by-id";
import { motion } from "framer-motion";
import { BookOpen, Info, Users } from "lucide-react";
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
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return toast.error(error?.message);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion du groupe
          </h1>
          <p className="text-muted-foreground">
            Gérez les paramètres et le contenu de votre groupe
          </p>
        </div>
        <DeleteGroupButton id={id} />
      </div>

      <div className="space-y-8">
        {/* Section Informations */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Info className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Informations du groupe</h2>
          </div>

          <div className="space-y-4 md:pl-11">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Nom du groupe
              </h3>
              <p className="text-lg font-medium">{data.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Date de création
              </h3>
              <p className="text-foreground">
                {new Date(data.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section Élèves */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg border p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Gestion des élèves</h2>
          </div>

          <div className="space-y-6 md:pl-11">
            <AddStudentToGroupForm groupId={id} />
            <ListeMembers students={data.students} />
          </div>
        </motion.section>

        {/* Section Leçons */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg border p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Gestion des leçons</h2>
          </div>

          <div className="space-y-6 md:pl-11">
            <AddLessonToGroup groupId={id} />
            <LessonListe lessons={data.lessons} groupId={id} />
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
