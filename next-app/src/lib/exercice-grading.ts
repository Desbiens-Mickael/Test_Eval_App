import "server-only";

import {
  cardResponseShema,
  gapFillTextResponseShema,
  multipleChoiceResponseShema,
  trueOrFalseResponseShema,
} from "@/shema-zod/exercice-corection.shema";
import {
  contentCardInput,
  contentGapFillInput,
  contentMultipleChoiceInput,
  contentTrueOrFalseInput,
} from "@/shema-zod/exercice.shema";
import { calculateNote } from "@/lib/utils";

/**
 * Correction des exercices côté serveur.
 *
 * La note n'est jamais acceptée depuis le navigateur : elle est recalculée ici
 * à partir de la réponse de l'élève et de la solution stockée en base.
 */

type Score = { correctAnswers: number; maxCorrectAnswers: number };

const scoreCard = (content: contentCardInput, rawResponse: unknown): Score => {
  const response = cardResponseShema.parse(rawResponse);

  // Une carte ne compte que si elle apparaît une seule fois dans toute la
  // réponse, sinon il suffirait de la déposer dans toutes les colonnes.
  const occurrences = new Map<string, number>();
  response.forEach((col) =>
    col.cards.forEach((card) =>
      occurrences.set(card.id, (occurrences.get(card.id) ?? 0) + 1)
    )
  );

  let correctAnswers = 0;
  let maxCorrectAnswers = 0;
  content.forEach((col) => {
    maxCorrectAnswers += col.cards.length;
    const colResponse = response.find((r) => r.column === col.column);
    if (!colResponse) return;
    correctAnswers += col.cards.filter(
      (card) =>
        occurrences.get(card.id) === 1 &&
        colResponse.cards.some((rCard) => rCard.id === card.id)
    ).length;
  });

  return { correctAnswers, maxCorrectAnswers };
};

const scoreTrueOrFalse = (
  content: contentTrueOrFalseInput,
  rawResponse: unknown
): Score => {
  const response = trueOrFalseResponseShema.parse(rawResponse);
  const answersByIndex = new Map(response.map((r) => [r.index, r.answer]));

  const correctAnswers = content.filter(
    (question, index) => answersByIndex.get(index) === question.answer
  ).length;

  return { correctAnswers, maxCorrectAnswers: content.length };
};

const scoreGapFill = (
  content: contentGapFillInput,
  rawResponse: unknown
): Score => {
  const response = gapFillTextResponseShema.parse(rawResponse);

  const correctAnswers = content.answers.filter(
    (a) => (response[a.position] ?? "").trim() === a.answer
  ).length;

  return { correctAnswers, maxCorrectAnswers: content.answers.length };
};

const scoreMultipleChoice = (
  content: contentMultipleChoiceInput,
  rawResponse: unknown
): Score => {
  const response = multipleChoiceResponseShema.parse(rawResponse);

  const correctAnswers = content.filter((question, questionIndex) => {
    const studentAnswer = response.find(
      (r) => r.questionIndex === questionIndex
    );
    if (!studentAnswer) return false;

    const selected = new Set(studentAnswer.selectedAnswers);
    const expected = new Set(
      question.answers
        .map((answer, index) => (answer.isCorrect ? index : -1))
        .filter((index) => index !== -1)
    );

    return (
      selected.size === expected.size &&
      Array.from(selected).every((index) => expected.has(index))
    );
  }).length;

  return { correctAnswers, maxCorrectAnswers: content.length };
};

/**
 * Calcule la note d'un exercice à partir de la réponse de l'élève.
 * @throws {Error} si le type d'exercice est inconnu ou si la réponse ne correspond pas au type.
 */
export const gradeExercice = ({
  type,
  level,
  content,
  response,
}: {
  type: string;
  level: string;
  content: unknown;
  response: unknown;
}) => {
  let score: Score;

  switch (type) {
    case "Carte":
      score = scoreCard(content as contentCardInput, response);
      break;
    case "Vrai ou Faux":
      score = scoreTrueOrFalse(content as contentTrueOrFalseInput, response);
      break;
    case "Texte à trou":
      score = scoreGapFill(content as contentGapFillInput, response);
      break;
    case "Choix multiple":
      score = scoreMultipleChoice(
        content as contentMultipleChoiceInput,
        response
      );
      break;
    default:
      throw new Error(`Type d'exercice inconnu : ${type}`);
  }

  return calculateNote({ level, ...score });
};

/**
 * Retire les solutions du contenu d'un exercice avant de l'envoyer à un élève.
 * Pour les cartes, les colonnes sont renvoyées vides et les cartes sont
 * fournies à part, mélangées, pour ne pas révéler leur colonne.
 */
export const stripExerciceSolutions = (type: string, content: unknown) => {
  switch (type) {
    case "Carte": {
      const columns = content as contentCardInput;
      const cards = columns.flatMap((col) => col.cards);
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      return {
        content: columns.map((col) => ({ column: col.column, cards: [] })),
        cards,
      };
    }
    case "Vrai ou Faux":
      return {
        content: (content as contentTrueOrFalseInput).map((q) => ({
          question: q.question,
          answer: null,
        })),
      };
    case "Texte à trou": {
      const gapFill = content as contentGapFillInput;
      return {
        content: {
          text: gapFill.text,
          answers: gapFill.answers.map((a) => ({
            position: a.position,
            placeholder: a.placeholder,
            answer: "",
          })),
        },
      };
    }
    case "Choix multiple":
      return {
        content: (content as contentMultipleChoiceInput).map((q) => ({
          question: q.question,
          answers: q.answers.map((a) => ({
            answer: a.answer,
            isCorrect: false,
          })),
        })),
      };
    default:
      return { content: null };
  }
};
