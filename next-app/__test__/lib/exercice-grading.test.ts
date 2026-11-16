/**
 * @jest-environment node
 */
import {
  gradeExercice,
  stripExerciceSolutions,
} from "@/lib/exercice-grading";

const cardContent = [
  { column: "Animaux", cards: [{ id: "c1", content: "Chat" }] },
  {
    column: "Fruits",
    cards: [
      { id: "c2", content: "Pomme" },
      { id: "c3", content: "Poire" },
    ],
  },
];

const trueFalseContent = [
  { question: "Le ciel est bleu", answer: true },
  { question: "2 + 2 = 5", answer: false },
];

const gapFillContent = {
  text: ["Le", "chat", "dort"],
  answers: [{ answer: "chat", placeholder: "____", position: 1 }],
};

const multipleChoiceContent = [
  {
    question: "Quels sont des fruits ?",
    answers: [
      { answer: "Pomme", isCorrect: true },
      { answer: "Carotte", isCorrect: false },
      { answer: "Poire", isCorrect: true },
    ],
  },
  {
    question: "Capitale de la France ?",
    answers: [
      { answer: "Paris", isCorrect: true },
      { answer: "Lyon", isCorrect: false },
    ],
  },
];

describe("gradeExercice", () => {
  describe("coefficient selon le niveau", () => {
    it.each([
      ["Facile", 5],
      ["Difficile", 10],
      ["Très difficile", 20],
      ["Inconnu", 5],
    ])("niveau %s → coefficient %i", (level, coeficient) => {
      const result = gradeExercice({
        type: "Vrai ou Faux",
        level,
        content: trueFalseContent,
        response: [
          { index: 0, answer: true },
          { index: 1, answer: false },
        ],
      });
      expect(result).toEqual({ note: coeficient, coeficient });
    });
  });

  describe("Carte", () => {
    it("donne la note maximale quand chaque carte est dans sa colonne", () => {
      const result = gradeExercice({
        type: "Carte",
        level: "Facile",
        content: cardContent,
        response: cardContent,
      });
      expect(result.note).toBe(5);
    });

    it("compte les bonnes réponses partielles", () => {
      const result = gradeExercice({
        type: "Carte",
        level: "Difficile",
        content: cardContent,
        response: [
          { column: "Animaux", cards: [{ id: "c2", content: "Pomme" }] },
          {
            column: "Fruits",
            cards: [
              { id: "c1", content: "Chat" },
              { id: "c3", content: "Poire" },
            ],
          },
        ],
      });
      // 1 carte bien placée sur 3
      expect(result.note).toBe(3.33);
    });

    it("ne donne aucun point si une carte est déposée dans plusieurs colonnes", () => {
      const allCards = cardContent.flatMap((col) => col.cards);
      const result = gradeExercice({
        type: "Carte",
        level: "Facile",
        content: cardContent,
        response: [
          { column: "Animaux", cards: allCards },
          { column: "Fruits", cards: allCards },
        ],
      });
      expect(result.note).toBe(0);
    });
  });

  describe("Vrai ou Faux", () => {
    it("ignore les réponses non données", () => {
      const result = gradeExercice({
        type: "Vrai ou Faux",
        level: "Difficile",
        content: trueFalseContent,
        response: [
          { index: 0, answer: true },
          { index: 1, answer: null },
        ],
      });
      expect(result.note).toBe(5);
    });
  });

  describe("Texte à trou", () => {
    it("accepte la bonne réponse entourée d'espaces", () => {
      const result = gradeExercice({
        type: "Texte à trou",
        level: "Facile",
        content: gapFillContent,
        response: { 1: "  chat " },
      });
      expect(result.note).toBe(5);
    });

    it("refuse une mauvaise réponse", () => {
      const result = gradeExercice({
        type: "Texte à trou",
        level: "Facile",
        content: gapFillContent,
        response: { 1: "chien" },
      });
      expect(result.note).toBe(0);
    });
  });

  describe("Choix multiple", () => {
    it("exige exactement les bonnes réponses", () => {
      const result = gradeExercice({
        type: "Choix multiple",
        level: "Difficile",
        content: multipleChoiceContent,
        response: [
          { questionIndex: 0, selectedAnswers: [0, 2] },
          { questionIndex: 1, selectedAnswers: [1] },
        ],
      });
      expect(result.note).toBe(5);
    });

    it("ne donne aucun point si toutes les cases sont cochées", () => {
      const result = gradeExercice({
        type: "Choix multiple",
        level: "Facile",
        content: multipleChoiceContent,
        response: [
          { questionIndex: 0, selectedAnswers: [0, 1, 2] },
          { questionIndex: 1, selectedAnswers: [0, 1] },
        ],
      });
      expect(result.note).toBe(0);
    });

    it("ignore les réponses en double", () => {
      const result = gradeExercice({
        type: "Choix multiple",
        level: "Facile",
        content: multipleChoiceContent,
        response: [
          { questionIndex: 0, selectedAnswers: [0, 2, 2] },
          { questionIndex: 1, selectedAnswers: [0, 0] },
        ],
      });
      expect(result.note).toBe(5);
    });
  });

  describe("erreurs", () => {
    it("rejette un type d'exercice inconnu", () => {
      expect(() =>
        gradeExercice({
          type: "Inconnu",
          level: "Facile",
          content: [],
          response: [],
        })
      ).toThrow();
    });

    it("rejette une réponse qui ne correspond pas au type", () => {
      expect(() =>
        gradeExercice({
          type: "Carte",
          level: "Facile",
          content: cardContent,
          response: { 1: "chat" },
        })
      ).toThrow();
    });
  });
});

describe("stripExerciceSolutions", () => {
  it("vide les colonnes et fournit toutes les cartes à part (Carte)", () => {
    const { content, cards } = stripExerciceSolutions("Carte", cardContent);
    expect(content).toEqual([
      { column: "Animaux", cards: [] },
      { column: "Fruits", cards: [] },
    ]);
    expect(cards?.map((c) => c.id).sort()).toEqual(["c1", "c2", "c3"]);
  });

  it("ne modifie pas le contenu d'origine (Carte)", () => {
    const original = JSON.parse(JSON.stringify(cardContent));
    stripExerciceSolutions("Carte", cardContent);
    expect(cardContent).toEqual(original);
  });

  it("retire les réponses (Vrai ou Faux)", () => {
    const { content } = stripExerciceSolutions("Vrai ou Faux", trueFalseContent);
    expect(content).toEqual([
      { question: "Le ciel est bleu", answer: null },
      { question: "2 + 2 = 5", answer: null },
    ]);
  });

  it("retire les mots attendus (Texte à trou)", () => {
    const { content } = stripExerciceSolutions("Texte à trou", gapFillContent);
    expect(content).toEqual({
      text: gapFillContent.text,
      answers: [{ answer: "", placeholder: "____", position: 1 }],
    });
  });

  it("retire les bonnes réponses (Choix multiple)", () => {
    const { content } = stripExerciceSolutions(
      "Choix multiple",
      multipleChoiceContent
    );
    expect(JSON.stringify(content)).not.toContain("true");
  });
});
