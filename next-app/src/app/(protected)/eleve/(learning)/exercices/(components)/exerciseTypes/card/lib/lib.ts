// Fonction utilitaire pour mélanger un tableau (algorithme de Fisher-Yates)
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** Identifiant de la zone « Cartes à placer » */
export const START_ZONE = "start";

type Card = { id: string; content: string };
export type CardBoard = {
  startCards: Card[];
  response: { column: string; cards: Card[] }[];
};

/** Zone où se trouve une carte : `START_ZONE` ou le nom d'une colonne */
export const findCardZone = (board: CardBoard, cardId: string) => {
  if (board.startCards.some((c) => c.id === cardId)) return START_ZONE;
  return board.response.find((col) => col.cards.some((c) => c.id === cardId))
    ?.column;
};

/**
 * Déplace une carte vers une zone, à la fin (ou à `index`).
 * Alternative au glisser-déposer : clavier, écran tactile, lecteur d'écran.
 */
export const moveCardToZone = (
  board: CardBoard,
  cardId: string,
  destination: string,
  index?: number
): CardBoard => {
  const card =
    board.startCards.find((c) => c.id === cardId) ??
    board.response.flatMap((col) => col.cards).find((c) => c.id === cardId);
  const destinationExists =
    destination === START_ZONE ||
    board.response.some((col) => col.column === destination);
  if (!card || !destinationExists) return board;

  const insert = (cards: Card[]) => {
    const at = index === undefined ? cards.length : Math.min(index, cards.length);
    return [...cards.slice(0, at), card, ...cards.slice(at)];
  };
  const without = (cards: Card[]) => cards.filter((c) => c.id !== cardId);

  const startCards = without(board.startCards);
  return {
    startCards: destination === START_ZONE ? insert(startCards) : startCards,
    response: board.response.map((col) => {
      const cards = without(col.cards);
      return { ...col, cards: col.column === destination ? insert(cards) : cards };
    }),
  };
};

/** Nom lisible d'une zone, pour les annonces */
export const zoneLabel = (zone: string) =>
  zone === START_ZONE ? "les cartes à placer" : `la colonne « ${zone} »`;
