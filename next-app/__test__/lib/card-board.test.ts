import {
  CardBoard,
  START_ZONE,
  findCardZone,
  moveCardToZone,
  zoneLabel,
} from "@/app/(protected)/eleve/(learning)/exercices/(components)/exerciseTypes/card/lib/lib";

const a = { id: "a", content: "Chat" };
const b = { id: "b", content: "Chien" };
const c = { id: "c", content: "Rose" };

const board = (): CardBoard => ({
  startCards: [a, b],
  response: [
    { column: "Animaux", cards: [] },
    { column: "Fleurs", cards: [c] },
  ],
});

const ids = (cards: { id: string }[]) => cards.map((x) => x.id);

describe("moveCardToZone", () => {
  it("place une carte à la fin d'une colonne", () => {
    const next = moveCardToZone(board(), "a", "Animaux");
    expect(ids(next.startCards)).toEqual(["b"]);
    expect(ids(next.response[0].cards)).toEqual(["a"]);
  });

  it("déplace une carte d'une colonne à une autre", () => {
    const next = moveCardToZone(board(), "c", "Animaux");
    expect(ids(next.response[0].cards)).toEqual(["c"]);
    expect(next.response[1].cards).toEqual([]);
  });

  it("remet une carte dans les cartes à placer", () => {
    const next = moveCardToZone(board(), "c", START_ZONE);
    expect(ids(next.startCards)).toEqual(["a", "b", "c"]);
    expect(next.response[1].cards).toEqual([]);
  });

  it("respecte la position donnée par le glisser-déposer", () => {
    let next = moveCardToZone(board(), "a", "Fleurs", 0);
    expect(ids(next.response[1].cards)).toEqual(["a", "c"]);
    // Réordonner dans la même zone
    next = moveCardToZone(board(), "b", START_ZONE, 0);
    expect(ids(next.startCards)).toEqual(["b", "a"]);
  });

  it("ne duplique jamais une carte", () => {
    const next = moveCardToZone(board(), "a", "Animaux");
    const all = [...next.startCards, ...next.response.flatMap((col) => col.cards)];
    expect(ids(all).sort()).toEqual(["a", "b", "c"]);
  });

  it("ignore une carte ou une colonne inconnue", () => {
    const initial = board();
    expect(moveCardToZone(initial, "zz", "Animaux")).toBe(initial);
    expect(moveCardToZone(initial, "a", "Inconnue")).toBe(initial);
  });
});

describe("findCardZone / zoneLabel", () => {
  it("trouve la zone d'une carte", () => {
    expect(findCardZone(board(), "a")).toBe(START_ZONE);
    expect(findCardZone(board(), "c")).toBe("Fleurs");
  });

  it("nomme la zone pour les annonces", () => {
    expect(zoneLabel(START_ZONE)).toBe("les cartes à placer");
    expect(zoneLabel("Fleurs")).toBe("la colonne « Fleurs »");
  });
});
