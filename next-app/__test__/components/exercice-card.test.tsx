import ExerciceCard from "@/app/(protected)/eleve/(learning)/exercices/(components)/exerciseTypes/card/exercice-card";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

jest.mock("@/hooks/mutations/exercice/use-submit-exercice-response", () => ({
  useSubmitExerciceResponse: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    data: undefined,
  }),
}));
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

const content = [
  { column: "Animaux", cards: [] },
  { column: "Fleurs", cards: [] },
] as never;
const cards = [
  { id: "a", content: "Chat" },
  { id: "b", content: "Rose" },
];

// Radix ouvre ses menus au clavier ; jsdom n'implémente pas ces API
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
  Element.prototype.hasPointerCapture = jest.fn(() => false);
  Element.prototype.releasePointerCapture = jest.fn();
});

const openMoveMenu = async (cardLabel: string) => {
  // Attend la fermeture d'un menu précédent
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  const trigger = screen.getByRole("button", { name: `Déplacer la carte « ${cardLabel} »` });
  act(() => {
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
  });
  return await screen.findByRole("menu");
};

const columnOf = (name: string) =>
  screen.getByRole("heading", { name: new RegExp(name) }).closest("div.rounded-2xl") as HTMLElement;

it("chaque carte a une poignée et un bouton « Déplacer » nommés", () => {
  render(<ExerciceCard exerciceId="ex1" content={content} cards={cards} />);
  expect(screen.getByLabelText("Glisser la carte « Chat »")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Déplacer la carte « Rose »" })).toBeInTheDocument();
});

it("place une carte dans une colonne sans glisser, et l'annonce", async () => {
  render(<ExerciceCard exerciceId="ex1" content={content} cards={cards} />);

  const menu = await openMoveMenu("Chat");
  // Depuis les cartes à placer : toutes les colonnes, pas « Remettre »
  expect(within(menu).getByRole("menuitem", { name: "Animaux" })).toBeInTheDocument();
  expect(within(menu).queryByRole("menuitem", { name: /Remettre/ })).toBeNull();

  act(() => {
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Animaux" }));
  });

  expect(within(columnOf("Animaux")).getByText("Chat")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Carte « Chat » déplacée dans la colonne « Animaux »."
  );
});

it("remet une carte placée dans les cartes à placer", async () => {
  render(<ExerciceCard exerciceId="ex1" content={content} cards={cards} />);
  const firstMenu = await openMoveMenu("Rose");
  act(() => {
    fireEvent.click(within(firstMenu).getByRole("menuitem", { name: "Fleurs" }));
  });

  const menu = await openMoveMenu("Rose");
  // La colonne actuelle n'est pas proposée
  expect(within(menu).queryByRole("menuitem", { name: "Fleurs" })).toBeNull();
  act(() => {
    fireEvent.click(within(menu).getByRole("menuitem", { name: /Remettre/ }));
  });

  expect(within(columnOf("Fleurs")).queryByText("Rose")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("déplacée dans les cartes à placer");
});
