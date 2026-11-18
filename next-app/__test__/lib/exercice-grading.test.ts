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

const pairsContent = [
  { left: "Chat", right: "Miaule" },
  { left: "Chien", right: "Aboie" },
  { left: "Vache", right: "Meugle" },
  { left: "Mouton", right: "Bêle" },
];

const orderingContent = [
  { instruction: "Du plus petit au plus grand", items: ["1", "2", "3", "4"] },
  { instruction: "Les saisons depuis le printemps", items: ["Printemps", "Été", "Automne", "Hiver"] },
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

describe("gradeExercice : Associer par paires", () => {
  const grade = (response: unknown) =>
    gradeExercice({ type: "Associer par paires", level: "Facile", content: pairsContent, response });

  it("donne la note maximale quand toutes les paires sont justes", () => {
    const response = pairsContent.map((pair, index) => ({ index, answer: pair.right }));
    expect(grade(response).note).toBe(5);
  });

  it("compte une paire juste sur quatre", () => {
    expect(
      grade([
        { index: 0, answer: "Miaule" },
        { index: 1, answer: "Meugle" },
        { index: 2, answer: "Aboie" },
        { index: 3, answer: "" },
      ]).note
    ).toBe(1.25);
  });

  it("ignore les espaces autour de la réponse", () => {
    expect(grade([{ index: 0, answer: " Miaule " }]).note).toBe(1.25);
  });

  it("rejette une réponse d'un autre type", () => {
    expect(() => grade([{ index: 0, answer: true }])).toThrow();
  });
});

describe("gradeExercice : Remettre dans l'ordre", () => {
  const grade = (response: unknown) =>
    gradeExercice({ type: "Remettre dans l'ordre", level: "Facile", content: orderingContent, response });

  it("donne la note maximale quand tout est dans l'ordre", () => {
    const response = orderingContent.map((s, index) => ({ index, order: s.items }));
    expect(grade(response).note).toBe(5);
  });

  it("compte un point par élément placé au bon rang", () => {
    const result = grade([
      // 1 et 4 bien placés
      { index: 0, order: ["1", "3", "2", "4"] },
      // aucun bien placé
      { index: 1, order: ["Hiver", "Printemps", "Été", "Automne"] },
    ]);
    // 2 bons rangs sur 8
    expect(result.note).toBe(1.25);
  });

  it("ne donne aucun point à une liste trafiquée (élément répété)", () => {
    const result = grade([
      { index: 0, order: ["1", "1", "1", "1"] },
      { index: 1, order: orderingContent[1].items },
    ]);
    expect(result.note).toBe(2.5);
  });

  it("ne donne aucun point à une liste incomplète", () => {
    expect(grade([{ index: 0, order: ["1", "2", "3"] }]).note).toBe(0);
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

  it("sépare les paires et mélange la colonne de droite (Associer par paires)", () => {
    const { content } = stripExerciceSolutions("Associer par paires", pairsContent) as {
      content: { lefts: string[]; rights: string[] };
    };
    expect(content.lefts).toEqual(["Chat", "Chien", "Vache", "Mouton"]);
    expect([...content.rights].sort()).toEqual(["Aboie", "Bêle", "Meugle", "Miaule"]);
    expect(content.rights).not.toEqual(["Miaule", "Aboie", "Meugle", "Bêle"]);
  });

  it("mélange chaque liste sans la laisser dans le bon ordre (Remettre dans l'ordre)", () => {
    for (let run = 0; run < 20; run++) {
      const { content } = stripExerciceSolutions("Remettre dans l'ordre", orderingContent) as {
        content: { instruction: string; items: string[] }[];
      };
      content.forEach((sequence, index) => {
        expect(sequence.instruction).toBe(orderingContent[index].instruction);
        expect([...sequence.items].sort()).toEqual([...orderingContent[index].items].sort());
        expect(sequence.items).not.toEqual(orderingContent[index].items);
      });
    }
  });

  it("mélange aussi une liste de deux éléments", () => {
    const { content } = stripExerciceSolutions("Remettre dans l'ordre", [
      { instruction: "Ordre", items: ["A", "B"] },
    ]) as { content: { items: string[] }[] };
    expect(content[0].items).toEqual(["B", "A"]);
  });
});
