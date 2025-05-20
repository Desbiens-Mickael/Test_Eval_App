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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Ellipsis, Trash2 } from "lucide-react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import useContentCardStore from "./store/store-content-card";

interface CardProps {
  columnIndex: number;
  cardIndex: string;
  contentCard: string;
  isEditing?: boolean;
}

const Card = memo(
  ({ columnIndex, cardIndex, contentCard, isEditing }: CardProps) => {
    const [inputCard, setInputCard] = useState(contentCard);
    const [showInput, setShowInput] = useState(!contentCard);
    const { updateCard, removeCard } = useContentCardStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Fonction pour ajuster la hauteur du textarea
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, []);

    // Fonction pour mettre à jour la carte
    const handleUpdateCard = useCallback(() => {
      if (!inputCard.trim()) {
        !contentCard
          ? removeCard(columnIndex, cardIndex)
          : setInputCard(contentCard);
      } else if (inputCard !== contentCard) {
        updateCard(columnIndex, cardIndex, inputCard);
      }
      setShowInput(false);
    }, [
      inputCard,
      contentCard,
      columnIndex,
      cardIndex,
      updateCard,
      removeCard,
    ]);

    // Fonction pour surveiller les changements dans le textarea
    const handleTextareaChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputCard(e.target.value);
        adjustHeight();
      },
      [adjustHeight]
    );

    // Fonction pour surveiller les touches de clavier dans le textarea
    const handleTextareaKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleUpdateCard();
        }
      },
      [handleUpdateCard]
    );

    // Pour ouvrir et mettre le focus sur le textarea quand une nouvelle carte est ajoutée
    useEffect(() => {
      if (!contentCard) {
        textareaRef.current?.focus();
      }
      adjustHeight();
    }, [contentCard, adjustHeight]);

    // Pour mettre le focus sur le textarea quand la carte est modifiée
    useEffect(() => {
      if (showInput && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [showInput]);

    const cardClass = cn(
      "w-full min-h-[60px] h-auto text-sm overflow-hidden transition-all duration-200",
      "bg-card border border-border rounded-md shadow-sm hover:shadow-md",
      "flex items-center relative group"
    );

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full"
      >
        {isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-100",
                  "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  "transition-opacity duration-200 z-10"
                )}
                onClick={(e) => {
                  // Empêche le déclenchement du clic sur la carte
                  e.stopPropagation();
                }}
              >
                <Ellipsis className="h-3.5 w-3.5" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onSelect={(e) => {
                  e.preventDefault();
                  removeCard(columnIndex, cardIndex);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showInput && isEditing ? (
          <Textarea
            ref={textareaRef}
            className={cn(
              cardClass,
              "px-4 py-3 pr-10 resize-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            placeholder="Saisissez le contenu de la carte..."
            onFocus={(e) => {
              adjustHeight();
              e.target.selectionStart = e.target.value.length;
            }}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            onBlur={handleUpdateCard}
            value={inputCard}
            rows={1}
          />
        ) : (
          <div
            className={cn(
              cardClass,
              "px-4 py-3 cursor-text relative",
              !inputCard && "text-muted-foreground italic"
            )}
            onClick={(e) => {
              // Ne déclenche l'édition que si on ne clique pas sur le bouton du menu
              if (!(e.target as HTMLElement).closest("button")) {
                isEditing && setShowInput(true);
              }
            }}
          >
            <p className="flex-1 break-words">
              {inputCard || "Cliquez pour éditer..."}
            </p>
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
