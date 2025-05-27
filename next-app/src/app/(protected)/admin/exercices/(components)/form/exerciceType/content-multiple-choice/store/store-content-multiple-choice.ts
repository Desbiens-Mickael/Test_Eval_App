import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { create } from "zustand";

// Interface du store
interface ContentMultipleChoiceStore {
  content: multipleChoiceInput[];
  onChange: ((questions: multipleChoiceInput[]) => void) | null;
  setInitialValues: (
    initialValues: multipleChoiceInput[],
    onChange?: (questions: multipleChoiceInput[]) => void
  ) => void;

  // Opérations CRUD pour les questions
  addQuestion: () => void;
  updateQuestion: (index: number, value: string) => void;
  deleteQuestion: (index: number) => void;

  // Opérations CRUD pour les réponses
  addAnswer: (questionIndex: number) => void;
  updateAnswer: (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => void;
  updateCorrect: (
    questionIndex: number,
    answerIndex: number,
    value: boolean
  ) => void;
  deleteAnswer: (questionIndex: number, answerIndex: number) => void;
}

// Création du store Zustand
export const useContentMultipleChoiceStore = create<ContentMultipleChoiceStore>(
  (set, get) => ({
    content: [],
    onChange: null,
    setInitialValues: (initialValues, onChange) => {
      set({ content: initialValues, onChange });
    },

    // Méthodes pour les questions
    addQuestion: () => {
      const { content, onChange } = get();
      const defaultQuestion: multipleChoiceInput = {
        question: "",
        answers: [
          { answer: "", isCorrect: false },
          { answer: "", isCorrect: false },
        ],
      };
      set({ content: [defaultQuestion, ...content] });
      onChange?.([defaultQuestion, ...content]);
    },

    updateQuestion: (index, value) => {
      const { content, onChange } = get();
      const updatedContent = [...content];
      updatedContent[index].question = value;
      set({ content: updatedContent });
      onChange?.(updatedContent);
    },

    deleteQuestion: (index) => {
      const { content, onChange } = get();
      const updatedContent = [...content];
      updatedContent.splice(index, 1);
      set({ content: updatedContent });
      onChange?.(updatedContent);
    },

    // Méthodes pour les réponses
    addAnswer: (questionIndex) => {
      const { content, onChange } = get();
      const updatedContent = [...content];
      updatedContent[questionIndex].answers.push({
        answer: "",
        isCorrect: false,
      });
      set({ content: updatedContent });
      onChange?.(updatedContent);
    },

    updateAnswer: (questionIndex, answerIndex, value) => {
      const { content, onChange } = get();
      const updatedContent = [...content];
      updatedContent[questionIndex].answers[answerIndex].answer = value;
      set({ content: updatedContent });
      onChange?.(updatedContent);
    },

    updateCorrect: (questionIndex, answerIndex, value) => {
      const { content, onChange } = get();
      const updatedContent = [...content];
      updatedContent[questionIndex].answers[answerIndex].isCorrect = value;
      set({ content: updatedContent });
      onChange?.(updatedContent);
    },

    deleteAnswer: (questionIndex, answerIndex) => {
      const { content, onChange } = get();
      const updatedContent = [...content];
      updatedContent[questionIndex].answers.splice(answerIndex, 1);
      set({ content: updatedContent });
      onChange?.(updatedContent);
    },
  })
);
