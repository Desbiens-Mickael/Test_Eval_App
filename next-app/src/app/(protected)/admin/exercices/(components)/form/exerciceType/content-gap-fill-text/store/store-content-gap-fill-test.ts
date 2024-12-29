import { create } from "zustand";
import {
  AnswerInput,
  contentGapFillInput,
} from "../content-gap-fill-text-form";

interface ContentGapFillTextStore {
  content: contentGapFillInput;
  onChange: ((newValue: contentGapFillInput) => void) | null;
  setInitialValues: (
    initialValue: contentGapFillInput,
    onChange?: (newValue: contentGapFillInput) => void
  ) => void;

  // Modification du texte
  updateText: (newValue: string[]) => void;

  // CRUD des reponses
  addAnswer: (answer: AnswerInput) => void;
  removeAnswer: (position: number) => void;
}

export const useContentGapFillTextStore = create<ContentGapFillTextStore>(
  (set, get) => ({
    content: { text: [], answers: [] },
    onChange: null,
    setInitialValues: (initialValue, onChange) => {
      set({ content: initialValue, onChange });
    },
    updateText: (newValue) => {
      const { content, onChange } = get();
      set({ content: { ...content, text: newValue } });
      onChange?.({ ...content, text: newValue });
    },
    addAnswer: (answer) => {
      const { content, onChange } = get();
      set({
        content: {
          ...content,
          answers: [...(content.answers ?? []), answer],
        },
      });
      onChange?.({
        ...content,
        answers: [...(content.answers ?? []), answer],
      });
    },
    removeAnswer: (position) => {
      const { content, onChange } = get();
      set({
        content: {
          ...content,
          answers: content.answers.filter(
            (answer) => answer.position !== position
          ),
        },
      });
      onChange?.({
        ...content,
        answers: content.answers.filter(
          (answer) => answer.position !== position
        ),
      });
    },
  })
);
