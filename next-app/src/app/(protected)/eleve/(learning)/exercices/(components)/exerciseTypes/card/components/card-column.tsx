import { cardItemInput } from "@/shema-zod/exercice.shema";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import DraggableCard from "./draggable-card";

interface CardColumnProps {
  column: string;
  cards: cardItemInput[];
}

export default function CardColumn({ column, cards }: CardColumnProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-5 py-3 border-b border-border">
        <h3 className="font-bold text-lg text-foreground flex items-center">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-background rounded-full text-primary text-sm font-bold mr-2 shadow-sm">
            {cards.length}
          </span>
          {column}
        </h3>
      </div>
      <Droppable droppableId={column} direction="vertical">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-3 p-4 transition-colors duration-300 min-h-[150px] ${
              snapshot.isDraggingOver ? "bg-primary/5" : "bg-card"
            } ${
              cards.length === 0
                ? "border-2 border-dashed border-border rounded-lg m-2"
                : ""
            }`}
          >
            {cards.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-sm">Déposez les cartes ici</p>
              </div>
            )}
            {cards.map((card, idx) => (
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
