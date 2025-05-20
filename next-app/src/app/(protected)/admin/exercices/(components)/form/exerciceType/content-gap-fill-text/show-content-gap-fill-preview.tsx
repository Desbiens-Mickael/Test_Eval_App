"use client";

import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnswerBadge } from "./answer-badge";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

interface ShowContentGapFillPreviewProps {
  modifiedText: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
};

export default function ShowContentGapFillPreview({
  modifiedText,
}: ShowContentGapFillPreviewProps) {
  const { content } = useContentGapFillTextStore();

  if (!content.answers?.length) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={containerRef}
      className="w-full space-y-6 p-6 rounded-lg bg-background border shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="space-y-3"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <motion.div className="space-y-2" variants={itemVariants} custom={0}>
          <h3 className="text-lg font-semibold text-foreground">
            Aperçu de l'exercice
          </h3>
          <div className="rounded-lg bg-muted/50 p-4 border">
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
              {modifiedText}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="space-y-2 pt-2"
          variants={itemVariants}
          custom={1}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              Réponses à trouver
            </h3>
            <Badge variant="outline" className="bg-background">
              {content.answers.length}{" "}
              {content.answers.length > 1 ? "réponses" : "réponse"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {content.answers.map((answer, index) => (
                <AnswerBadge
                  key={answer.position}
                  answer={answer}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
