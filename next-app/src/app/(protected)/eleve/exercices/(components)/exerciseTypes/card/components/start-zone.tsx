"use client";

import { cardItemInput } from "@/shema-zod/exercice.shema";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface StartZoneProps {
  startCards: cardItemInput[];
}

export default function StartZone({ startCards }: StartZoneProps) {
  return (
    <div className="mb-8 relative z-50">
      <h2 className="font-bold text-lg text-blue-800 mb-4 tracking-tight flex items-center gap-2">
        Cartes à placer
      </h2>
      <Droppable droppableId="start" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`max-w-[calc(100%-2rem)] flex flex-wrap gap-2 sm:gap-3 border-2 p-2 sm:p-4 rounded-xl min-h-[70px] transition-all duration-200 ${
              snapshot.isDraggingOver
                ? "border-transparent bg-blue-100/70 shadow-lg"
                : "border-gray-200 bg-gradient-to-r from-blue-50 to-white shadow-inner"
            }`}
          >
            {/* Si toutes les cartes ont été placées, afficher un message */}
            {startCards.length === 0 && (
              <span className="text-gray-400 italic">
                Toutes les cartes ont été placées !
              </span>
            )}

            {/* Sinon, afficher les cartes */}
            {startCards.map((card, idx) => (
              <Draggable key={card.id} draggableId={card.id} index={idx}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white border-2 ${
                      snapshot.isDragging
                        ? "border-blue-400 shadow-lg "
                        : "border-gray-200 shadow"
                    } px-5 py-3 rounded-xl cursor-grab font-semibold text-blue-900 transition-all duration-150 hover:bg-blue-50 hover:shadow-xl select-none`}
                    style={{
                      ...provided.draggableProps.style,
                      zIndex: snapshot.isDragging ? 100 : 1,
                      touchAction: "none",
                    }}
                  >
                    <span className="inline-block align-middle mr-2 text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </span>
                    {card.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
