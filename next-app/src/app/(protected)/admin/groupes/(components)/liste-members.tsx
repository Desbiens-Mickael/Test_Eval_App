"use client";

import { cn } from "@/lib/utils";
import { Student } from "@/type/student";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock } from "lucide-react";

interface ListeMembersProps {
  students: Student[];
}

export default function ListeMembers({ students }: ListeMembersProps) {
  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center rounded-lg bg-muted/30"
      >
        <p className="text-muted-foreground">
          Aucun élève n'est inscrit dans ce groupe.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {students.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between group relative p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-medium text-foreground">{user.name}</h3>
              </div>

              {user.identifier && (
                <p className="mt-1.5 pl-11 text-sm text-muted-foreground">
                  {user.identifier}
                </p>
              )}
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                user.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              )}
            >
              {user.isActive ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Actif</span>
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  <span>En attente</span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
