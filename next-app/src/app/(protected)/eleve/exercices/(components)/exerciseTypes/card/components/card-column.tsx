import { cardItemInput } from "@/shema-zod/exercice.shema";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface CardColumnProps {
  column: string;
  cards: cardItemInput[];
}

export default function CardColumn({ column, cards }: CardColumnProps) {
  return (
    <div className="bg-white border-2 border-blue-100 rounded-xl shadow-md p-4 min-h-[200px] h-fit transition-all duration-200">
      <h3 className="font-bold text-lg text-blue-900 mb-4 pb-2 border-b-2 border-blue-50">
        {column}
      </h3>
      <Droppable droppableId={column} direction="vertical">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 min-h-[40px] h-[calc(100%-60px)] rounded-lg p-3 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-blue-100/70" : "bg-blue-50/50"
            }`}
          >
            {/* On applique le même style que les cartes de la zone de départ pour l’uniformité visuelle */}
            {cards.map((card, idx) => (
              <Draggable key={card.id} draggableId={card.id} index={idx}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      zIndex: snapshot.isDragging ? 100 : 1,
                      touchAction: "none",
                    }}
                    className={`bg-white border-2 ${
                      snapshot.isDragging
                        ? "border-blue-400 shadow-lg"
                        : "border-gray-200 shadow"
                    } px-5 py-3 rounded-xl cursor-grab font-semibold text-blue-900 transition-all duration-150 hover:bg-blue-50 hover:shadow-xl select-none flex items-center`}
                  >
                    {/* Icône de déplacement */}
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
