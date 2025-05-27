"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/type/student";
import { motion } from "framer-motion";
import { ChevronRight, FolderKanban, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  id: string;
  name: string;
  students: Student[];
}

export default function GroupCard({ id, name, students }: GroupCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] xl:w-[300px]"
    >
      <Card
        onClick={() => router.push(`/admin/groupes/${id}`)}
        className="h-full flex flex-col border border-border/30 dark:border-border/50 
        bg-background/50 dark:bg-background/70 hover:bg-accent/50 dark:hover:bg-accent/20
        transition-all duration-300 cursor-pointer group overflow-hidden"
      >
        <CardHeader className="relative p-5 pb-3">
          <div className="absolute right-5 top-5 text-muted-foreground/50 group-hover:text-primary transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div className="pr-8">
              <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                {name}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span
                  className={
                    students.length === 0
                      ? "italic"
                      : "font-medium text-foreground/90"
                  }
                >
                  {students.length === 0
                    ? "Aucun élève"
                    : `${students.length} ${
                        students.length > 1 ? "élèves" : "élève"
                      }`}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="h-2 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/30 transition-all duration-500"
              style={{ width: `${Math.min(100, students.length * 10)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
