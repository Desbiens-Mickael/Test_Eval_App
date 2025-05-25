"use client";

import { cardItemInput } from "@/shema-zod/exercice.shema";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import DraggableCard from "./draggable-card";

interface StartZoneProps {
  startCards: cardItemInput[];
}

export default function StartZone({ startCards }: StartZoneProps) {
  return (
    <div className="mb-10 relative z-50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg md:text-xl text-foreground tracking-tight flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
          <span className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-bold mr-1">
            {startCards.length}
          </span>
          Cartes à placer
        </h2>
        {startCards.length > 0 && (
          <span className="text-sm text-muted-foreground bg-card/50 px-3 py-1 rounded-full border border-border">
            Glissez vers les colonnes ci-dessous
          </span>
        )}
      </div>
      <Droppable droppableId="start" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 transition-colors duration-300 min-h-[150px] rounded-xl border-2 ${
              snapshot.isDraggingOver 
                ? "border-primary/50 bg-primary/5" 
                : "border-dashed border-border bg-card"
            }`}
          >
            {startCards.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground font-medium">
                  Toutes les cartes ont été placées !
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Vous pouvez toujours les réorganiser dans les colonnes ci-dessous
                </p>
              </div>
            ) : (
              startCards.map((card, idx) => (
                <Draggable key={card.id} draggableId={card.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        touchAction: "none",
                      }}
                    >
                      <DraggableCard
                        card={card}
                        index={idx}
                        isDragging={snapshot.isDragging}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
