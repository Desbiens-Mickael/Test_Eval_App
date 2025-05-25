// src/components/learning/learning-dashboard.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { LessonSubjectChips } from "./LessonSubjectChips";

interface LearningDashboardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  selectedSubject: string | undefined;
  onSubjectChange: (subject: string | undefined) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function LearningDashboard({
  children,
  title,
  description = "Parcourez et révisez par matière",
  selectedSubject,
  onSubjectChange,
}: LearningDashboardProps) {
  return (
    <motion.div
      className="flex flex-col gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {title && (
        <motion.div variants={item} className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </motion.div>
      )}

      <motion.div variants={item} className="mb-4">
        <LessonSubjectChips
          selectedSubject={selectedSubject}
          handleSelectSubject={onSubjectChange}
        />
      </motion.div>

      <motion.div variants={item} className="w-full">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
