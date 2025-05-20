"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useRef } from "react";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

export default function AnswerList() {
  const { removeAnswer, content } = useContentGapFillTextStore();

  const handleAnswerRemove = useCallback(
    (position: number) => {
      const removedAnswer = content.answers?.find(
        (answer) => answer.position === position
      );
      if (!removedAnswer) return;

      // Restaurer le mot original dans content.text
      const updatedText = [...content.text];
      updatedText[position] = removedAnswer.answer;

      removeAnswer(position);
    },
    [content, removeAnswer]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  if (!content?.answers?.length) return null;

  return (
    <div className="w-full" ref={containerRef}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
        Réponses ajoutées
      </h4>

      <motion.ul className="flex flex-wrap gap-3" initial={false} layout>
        <AnimatePresence mode="popLayout">
          {content.answers.map((answer, index) => (
            <motion.li
              key={`${answer.position}-${answer.answer}`}
              layout
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                visible: (i: number) => ({
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: i * 0.05,
                  },
                }),
              }}
              custom={index}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: -20,
                transition: {
                  duration: 0.3,
                  ease: "easeIn",
                },
              }}
              className="h-auto relative"
            >
              <motion.div
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "inline-flex items-center gap-1.5 h-auto py-1.5 px-3",
                    "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
                    "transition-all duration-200 ease-out"
                  )}
                >
                  <span className="font-medium text-foreground">
                    {answer.answer}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-5 p-0.5 ml-1 -mr-1.5 text-muted-foreground",
                      "hover:bg-transparent hover:text-destructive"
                    )}
                    onClick={() => handleAnswerRemove(answer.position)}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">
                      Supprimer la réponse "{answer.answer}"
                    </span>
                  </Button>
                </Badge>
              </motion.div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
