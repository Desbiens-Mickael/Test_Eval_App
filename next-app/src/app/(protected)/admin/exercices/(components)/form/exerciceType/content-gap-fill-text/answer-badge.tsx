"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRef } from "react";

interface AnswerBadgeProps {
  answer: {
    position: number;
    answer: string;
  };
  index: number;
}

export function AnswerBadge({ answer, index }: AnswerBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  return (
    <motion.div
      ref={ref}
      key={answer.position}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit={{ opacity: 0, scale: 0.9 }}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: i * 0.05,
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        })
      }}
      layout
    >
      <Badge 
        variant="secondary"
        className={cn(
          "h-auto py-1.5 px-3 text-sm font-medium",
          "bg-primary/10 text-primary hover:bg-primary/20",
          "border border-primary/20"
        )}
      >
        <CheckCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
        {answer.answer}
      </Badge>
    </motion.div>
  );
}
