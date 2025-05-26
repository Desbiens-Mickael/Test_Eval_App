"use client";

import { cn } from "@/lib/utils";
import { cardItemInput } from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { CSSProperties, ReactNode } from "react";

interface DraggableCardProps {
  card: cardItemInput;
  index: number;
  isDragging: boolean;
  children?: ReactNode;
  dragHandleProps?: any;
  style?: CSSProperties;
  className?: string;
}

const DraggableCard = ({
  card,
  index,
  isDragging,
  children,
  dragHandleProps = {},
  style = {},
  className = "",
}: DraggableCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: index * 0.03,
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 },
      }}
      whileHover={
        !isDragging
          ? {
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }
          : {}
      }
      whileTap={{
        scale: 1.01,
        transition: { duration: 0.1 },
      }}
      className={cn(
        "bg-card border rounded-xl p-3 relative",
        isDragging
          ? "border-primary shadow-lg bg-primary/5"
          : "border-border hover:border-primary/50",
        className
      )}
      style={style}
    >
      <div className="flex items-center">
        <div
          className="text-primary mr-2 cursor-grab active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        {children || (
          <span className="text-sm font-medium text-foreground">
            {card.content}
          </span>
        )}
      </div>
      {isDragging && (
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-xl z-[-1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

export default DraggableCard;
