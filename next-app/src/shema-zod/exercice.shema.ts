import { z } from "zod";
const cardItemSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Les cartes doivent contenir des valeurs"),
});

// Schéma des differents types de base pour la création des leçons
const columnSchema = z.object({
  column: z.string().min(1, "La colonne ne peut pas etre vide"),
  cards: z
    .array(cardItemSchema)
    .nonempty("Chaque colonne doit avoir au moins une carte"),
});

export const trueOrFalseShema = z.object({
  question: z.string().min(1, "La question ne peut pas etre vide"),
  answer: z.boolean(),
});

export const multipleChoiceShema = z.object({
  question: z.string().min(1, "La question ne peut pas etre vide"),
  answers: z
    .array(
      z.object({
        answer: z.string().min(1, "La réponse ne peut pas etre vide"),
        isCorrect: z.boolean(),
      })
    )
    .nonempty("Chaque réponse doit avoir une valeur"),
});

export const contentGapFillSchema = z
  .object({
    text: z
      .array(z.string().min(1, "Le contenu de l'exercice est requis"))
      .nonempty("Le contenu de l'exercice est requis"),
    answers: z
      .array(
        z.object({
          answer: z.string().min(1, "La réponse ne peut pas etre vide"),
          placeholder: z.string().min(1, "Le contenu de l'exercice est requis"),
          position: z.number().min(0, "La position doit être positive"),
        })
      )
      .nonempty("Le contenu de l'exercice est requis"),
  })
  .required();

// Schéma des differents types pour la création des leçons
export const contentCardSchema = z
  .array(columnSchema)
  .nonempty("Le contenu de l'exercice est requis")
  // Effectue une validation supplémentaire pour vérifier la validité du contenu
  .superRefine((content, ctx) => {
    // Vérifie si une colonne ou une carte est invalide
    const hasInvalidColumnOrCards = content.some(
      (item) =>
        item.column.trim() === "" ||
        item.cards.length === 0 ||
        item.cards.some((card) => card.content.trim() === "")
    );
    if (hasInvalidColumnOrCards) {
      // Ajoute un message d'erreur personnalisé si une colonne ou une carte est invalide
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Le contenu de l'exercice est invalide. Veuillez corriger les colonnes ou les cartes.",
      });
    }
  });

export const contentMultipleChoiceShema = z
  .array(multipleChoiceShema)
  .nonempty("Le contenu de l'exercice est requis")
  .superRefine((content, ctx) => {
    const hasInvalidColumnOrCards = content.some(
      (item) =>
        item.question.trim() === "" ||
        item.answers.length === 0 ||
        item.answers.some((answer) => answer.answer.trim() === "")
    );
    if (hasInvalidColumnOrCards) {
      // Ajoute un message d'erreur personnalisé si une colonne ou une carte est invalide
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Le contenu de l'exercice est invalide. Veuillez corriger les questions ou les réponses.",
      });
    }
  });

export const contentTrueOrFalseSchema = z
  .array(trueOrFalseShema)
  .nonempty("Le contenu de l'exercice est requis")
  .superRefine((content, ctx) => {
    // Vérifie si une colonne ou une carte est invalide
    const hasInvalidColumnOrCards = content.some(
      (item) => item.question.trim() === ""
    );
    if (hasInvalidColumnOrCards) {
      // Ajoute un message d'erreur personnalisé si une colonne ou une carte est invalide
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Le contenu de l'exercice est invalide. Veuillez corriger les questions ou les réponses.",
      });
    }
  });

// Associer par paires : chaque élément de gauche va avec un élément de droite
export const matchingPairShema = z.object({
  left: z.string().trim().min(1, "Chaque paire doit avoir un élément à gauche"),
  right: z.string().trim().min(1, "Chaque paire doit avoir un élément à droite"),
});

export const contentMatchingPairsShema = z
  .array(matchingPairShema)
  .min(2, "Ajoutez au moins deux paires");

// Remettre dans l'ordre : chaque liste est enregistrée dans le bon ordre
export const orderingSequenceShema = z.object({
  instruction: z.string().trim().min(1, "La consigne ne peut pas être vide"),
  items: z
    .array(z.string().trim().min(1, "Les éléments ne peuvent pas être vides"))
    .min(2, "Chaque liste doit avoir au moins deux éléments"),
});

export const contentOrderingShema = z
  .array(orderingSequenceShema)
  .min(1, "Ajoutez au moins une liste à remettre dans l'ordre")
  .superRefine((content, ctx) => {
    // Une liste dont tous les éléments sont identiques n'a pas d'ordre à retrouver
    content.forEach((sequence, index) => {
      if (new Set(sequence.items.map((i) => i.trim())).size < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "items"],
          message: "Les éléments d'une liste doivent être différents",
        });
      }
    });
  });

// Réponse libre : l'élève rédige, le professeur note chaque question
export const FREE_RESPONSE_TYPE = "Réponse libre";
export const FREE_RESPONSE_MAX_POINTS = 20;
export const FREE_RESPONSE_MODEL_ANSWER_MAX_LENGTH = 2000;

export const freeResponseQuestionShema = z.object({
  question: z.string().trim().min(1, "La question ne peut pas être vide"),
  points: z.coerce
    .number({ invalid_type_error: "Le barème doit être un nombre" })
    .int("Le barème doit être un nombre entier de points")
    .min(1, "Chaque question vaut au moins 1 point")
    .max(FREE_RESPONSE_MAX_POINTS, `Une question vaut au plus ${FREE_RESPONSE_MAX_POINTS} points`),
  // Réponse attendue : aide le professeur à corriger, montrée à l'élève une fois noté
  modelAnswer: z
    .string()
    .trim()
    .max(
      FREE_RESPONSE_MODEL_ANSWER_MAX_LENGTH,
      `La réponse attendue ne peut pas dépasser ${FREE_RESPONSE_MODEL_ANSWER_MAX_LENGTH} caractères`
    ),
});

export const contentFreeResponseShema = z
  .array(freeResponseQuestionShema)
  .min(1, "Ajoutez au moins une question");

// Dictée : l'élève écoute l'enregistrement du professeur et écrit le texte
export const DICTATION_TYPE = "Dictée";
export const DICTATION_TEXT_MAX_LENGTH = 5000;
// Nom du fichier audio donné par le service d'upload : uuid4 + extension
const AUDIO_NAME_REGEX = /^[0-9a-f-]{36}\.(webm|ogg|mp3|m4a|wav)$/i;

export const contentDictationShema = z.object({
  audio: z
    .string({ required_error: "Enregistrez ou importez l'audio de la dictée" })
    .regex(AUDIO_NAME_REGEX, "Enregistrez ou importez l'audio de la dictée"),
  text: z
    .string()
    .trim()
    .min(1, "Écrivez le texte de la dictée : il sert de correction")
    .max(
      DICTATION_TEXT_MAX_LENGTH,
      `Le texte ne peut pas dépasser ${DICTATION_TEXT_MAX_LENGTH} caractères`
    )
    .refine(
      (text) => new RegExp("[\\p{L}\\p{N}]", "u").test(text),
      "Le texte doit contenir au moins un mot"
    ),
});

// Contrôle : noté, une seule tentative. Exercice (PRACTICE) : non noté, essais illimités.
export const EXERCICE_KINDS = ["CONTROL", "PRACTICE"] as const;
export const exerciceKindSchema = z.enum(EXERCICE_KINDS, {
  errorMap: () => ({ message: "Choisissez exercice ou contrôle" }),
});
export type ExerciceKindInput = z.infer<typeof exerciceKindSchema>;

export const createExerciceBaseSchema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    kind: exerciceKindSchema,
    description: z.string().min(1, "La description est requise"),
    exerciceTypeId: z.string().min(1, "Le sujet est requis"),
    exerciceLevelId: z.string().min(1, "Le niveau est requis"),
    // Période de validité d'un contrôle (ignorée pour un exercice)
    opensAt: z.coerce.date().nullable(),
    closesAt: z.coerce.date().nullable(),
  })
  .required();

/** Vérifie la cohérence des dates d'ouverture et de clôture d'un contrôle */
export const refineControlPeriod = (
  data: { kind: string; opensAt: Date | null; closesAt: Date | null },
  ctx: z.RefinementCtx
) => {
  if (data.kind !== "CONTROL") return;
  if (data.opensAt && data.closesAt && data.closesAt <= data.opensAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["closesAt"],
      message: "La clôture doit être après l'ouverture",
    });
  }
};

// Union des différents types de contenu pour pouvoir les utiliser dans le schéma global
const contentSchema = z.union([
  contentCardSchema,
  contentMultipleChoiceShema,
  contentGapFillSchema,
  contentTrueOrFalseSchema,
  contentMatchingPairsShema,
  contentOrderingShema,
  contentFreeResponseShema,
  contentDictationShema,
]);

/**
 * Schéma du contenu propre à chaque type d'exercice.
 * L'union `contentSchema` accepte n'importe quel type : le serveur vérifie en
 * plus que le contenu correspond bien au type choisi.
 */
export const contentSchemaByType: Record<string, z.ZodTypeAny> = {
  Carte: contentCardSchema,
  "Vrai ou Faux": contentTrueOrFalseSchema,
  "Texte à trou": contentGapFillSchema,
  "Choix multiple": contentMultipleChoiceShema,
  "Associer par paires": contentMatchingPairsShema,
  "Remettre dans l'ordre": contentOrderingShema,
  [FREE_RESPONSE_TYPE]: contentFreeResponseShema,
  [DICTATION_TYPE]: contentDictationShema,
};

export const globalExerciceSchema = createExerciceBaseSchema
  .extend({
    content: contentSchema,
  })
  .superRefine(refineControlPeriod);

// Définition des types d'entrée
export type cardItemInput = z.infer<typeof cardItemSchema>;
export type columnInput = z.infer<typeof columnSchema>;
export type contentCardInput = z.infer<typeof contentCardSchema>;
export type trueOrFalseInput = z.infer<typeof trueOrFalseShema>;
export type contentTrueOrFalseInput = z.infer<typeof contentTrueOrFalseSchema>;
export type multipleChoiceInput = z.infer<typeof multipleChoiceShema>;
export type contentMultipleChoiceInput = z.infer<
  typeof contentMultipleChoiceShema
>;
export type contentGapFillInput = z.infer<typeof contentGapFillSchema>;
export type matchingPairInput = z.infer<typeof matchingPairShema>;
export type contentMatchingPairsInput = z.infer<typeof contentMatchingPairsShema>;
export type orderingSequenceInput = z.infer<typeof orderingSequenceShema>;
export type contentOrderingInput = z.infer<typeof contentOrderingShema>;
export type freeResponseQuestionInput = z.infer<typeof freeResponseQuestionShema>;
export type contentFreeResponseInput = z.infer<typeof contentFreeResponseShema>;
export type contentDictationInput = z.infer<typeof contentDictationShema>;
/** Dictée vue par un élève : l'audio et le nombre de mots, sans le texte */
export type studentDictationContent = { audio: string; words: number };
/** Contrôle « Réponse libre » vu par un élève : sans les réponses attendues */
export type studentFreeResponseContent = { question: string; points: number }[];
/** Exercice « Associer par paires » vu par un élève : sans les solutions */
export type studentMatchingPairsContent = { lefts: string[]; rights: string[] };
/** Exercice « Remettre dans l'ordre » vu par un élève : éléments mélangés */
export type studentOrderingContent = { instruction: string; items: string[] }[];
export type contentInput = z.infer<typeof contentSchema>;
export type createExerciceFormInput = z.infer<typeof globalExerciceSchema>;
