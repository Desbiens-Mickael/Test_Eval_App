"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { cardItemInput } from "@/shema-zod/exercice.shema";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { ArrowRightLeft, GripVertical, Undo2 } from "lucide-react";
import { START_ZONE } from "../lib/lib";

interface DraggableCardProps {
  card: cardItemInput;
  index: number;
  isDragging: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  /** Zone actuelle de la carte : START_ZONE ou le nom d'une colonne */
  zone: string;
  /** Colonnes où la carte peut être déposée */
  columns: string[];
  onMove: (cardId: string, destination: string) => void;
}

const DraggableCard = ({
  card,
  index,
  isDragging,
  dragHandleProps,
  zone,
  columns,
  onMove,
}: DraggableCardProps) => {
  const destinations = columns.filter((column) => column !== zone);

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
      className={cn(
        "bg-card border rounded-xl p-1.5 relative",
        isDragging
          ? "border-primary shadow-lg bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center gap-1">
        {/* Poignée de glisser-déposer (souris, et clavier avec Espace + flèches) */}
        <div
          {...dragHandleProps}
          aria-label={`Glisser la carte « ${card.content} »`}
          className="flex h-10 w-8 shrink-0 cursor-grab items-center justify-center rounded-md text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" aria-hidden="true" />
        </div>

        <span className="min-w-0 flex-1 break-words py-2 text-sm font-medium text-foreground">
          {card.content}
        </span>

        {/* Alternative au glisser : choisir la colonne dans un menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              aria-label={`Déplacer la carte « ${card.content} »`}
            >
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-[min(20rem,90vw)]">
            <DropdownMenuLabel>Placer dans…</DropdownMenuLabel>
            {destinations.map((column) => (
              <DropdownMenuItem
                key={column}
                onSelect={() => onMove(card.id, column)}
                className="break-words"
              >
                {column}
              </DropdownMenuItem>
            ))}
            {zone !== START_ZONE && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onMove(card.id, START_ZONE)}>
                  <Undo2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Remettre dans les cartes à placer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default DraggableCard;
