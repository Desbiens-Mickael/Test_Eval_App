"use client";

import { Button } from "@/components/ui/button";
import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { useEffect } from "react";
import QuestionComponent from "./question-component";
import ShowPReviewMUltipleChoice from "./show-preview-multiple-choice";
import { useContentMultipleChoiceStore } from "./store/store-content-multiple-choice";

const defaultValue: multipleChoiceInput[] = [
  {
    question: "",
    answers: [
      { answer: "", isCorrect: false },
      { answer: "", isCorrect: false },
    ],
  },
];

interface ContentMUltipleCHoiceFormProps {
  initialValue?: multipleChoiceInput[];
  isEditing?: boolean;
  onChange?: (newValue: multipleChoiceInput[]) => void;
}

export default function ContentMUltipleCHoiceForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentMUltipleCHoiceFormProps) {
  const { content, setInitialValues, addQuestion } =
    useContentMultipleChoiceStore();

  useEffect(() => {
    const values =
      initialValue && initialValue.length > 0 ? initialValue : defaultValue;
    setInitialValues(values, onChange);

    return () => {
      setInitialValues(defaultValue);
    };
  }, [initialValue, onChange]);

  return (
    <div className="flex flex-col gap-4">
      {isEditing ? (
        <>
          <div className="w-full flex justify-center items-end gap-2">
            <div className="flex flex-col">
              <Button
                size="sm"
                onClick={addQuestion}
                className="w-full"
                type="button"
              >
                Ajouter une question
              </Button>
            </div>
          </div>

          {content.map((question, index) => (
            <QuestionComponent key={index} question={question} index={index} />
          ))}
        </>
      ) : (
        <ShowPReviewMUltipleChoice content={content} />
      )}
    </div>
  );
}
