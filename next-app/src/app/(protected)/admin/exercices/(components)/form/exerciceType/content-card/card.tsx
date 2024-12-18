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
import { Ellipsis } from "lucide-react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import useContentCardStore from "./store/store-content-card";

interface CardProps {
  columnIndex: number;
  cardIndex: number;
  card: string;
  isEditing?: boolean;
}

const Card = memo(({ columnIndex, cardIndex, card, isEditing }: CardProps) => {
  const [inputCard, setInputCard] = useState(card);
  const [showInput, setShowInput] = useState(!card);
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
      !card ? removeCard(columnIndex, cardIndex) : setInputCard(card);
    } else if (inputCard !== card) {
      updateCard(columnIndex, cardIndex, inputCard);
    }
    setShowInput(false);
  }, [inputCard, card, columnIndex, cardIndex, updateCard, removeCard]);

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
    if (!card) {
      textareaRef.current?.focus();
    }
    adjustHeight();
  }, [card, adjustHeight]);

  // Pour mettre le focus sur le textarea quand la carte est modifiée
  useEffect(() => {
    if (showInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showInput]);

  const sharedClassNames =
    "w-full min-h-[50px] h-auto bg-white text-sm overflow-hidden py-4 px-2 rounded-md";

  return (
    <div className="relative flex flex-col flex-1">
      {isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1 right-0 text-lg flex items-center justify-center h-[6px] w-fit p-2"
            >
              <Ellipsis size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10"
              onSelect={() => removeCard(columnIndex, cardIndex)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {showInput && isEditing ? (
        <Textarea
          ref={textareaRef}
          className={cn(sharedClassNames, "resize-none")}
          placeholder="Entrer une valeur"
          onFocus={(e) => {
            adjustHeight();
            e.target.selectionStart = e.target.value.length;
          }}
          onChange={handleTextareaChange}
          onKeyDown={handleTextareaKeyDown}
          onBlur={handleUpdateCard}
          value={inputCard}
        />
      ) : (
        <p
          className={cn(sharedClassNames, "cursor-pointer")}
          onClick={() => setShowInput(true)}
        >
          {inputCard}
        </p>
      )}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
