"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trueOrFalseInput } from "@/shema-zod/exercice.shema";
import { useEffect, useState } from "react";

export interface ContentTrueFalseFormProps {
  initialValue?: trueOrFalseInput[];
  isEditing?: boolean;
  onChange?: (newContent: trueOrFalseInput[]) => void;
}

const defaultContent: trueOrFalseInput[] = [
  { question: "", answer: false },
  { question: "", answer: false },
];

export default function ContentTrueFalseForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentTrueFalseFormProps) {
  const [content, setContent] = useState<trueOrFalseInput[]>(
    initialValue ?? defaultContent
  );

  useEffect(() => {
    if (onChange) {
      onChange(content ?? []);
    }
  }, [content]);

  useEffect(() => {
    if (!initialValue?.length) {
      setContent(defaultContent);
    }
  }, [initialValue]);

  const handleAddContent = () => {
    setContent((prev) => [...(prev ?? []), { question: "", answer: false }]);
  };

  const handleChange = (index: number, value: string) => {
    setContent(
      (prev) =>
        prev?.map((q, i) => (i === index ? { ...q, question: value } : q)) ?? []
    );
  };

  const handleChecked = (index: number, value: boolean) => {
    setContent(
      (prev) =>
        prev?.map((q, i) => (i === index ? { ...q, answer: value } : q)) ?? []
    );
  };

  return (
    <div>
      {isEditing ? (
        <>
          <div className="flex justify-center mb-4">
            <Button type="button" onClick={handleAddContent}>
              Ajouter une question
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            {content?.map((question, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg"
              >
                <Textarea
                  placeholder="Question"
                  value={question.question}
                  className="mb-2w-full resize-none"
                  onChange={(e) => handleChange(index, e.target.value)}
                />

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={question.answer ? "default" : "outline"}
                    type="button"
                    onClick={() => handleChecked(index, true)}
                  >
                    Vrai
                  </Button>
                  <Button
                    variant={!question.answer ? "default" : "outline"}
                    type="button"
                    onClick={() => handleChecked(index, false)}
                  >
                    Faux
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-4">
          {content?.map((question, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div>{`Question : ${question.question}`}</div>
                <div>{`Réponse : ${question.answer ? "Vrai" : "Faux"}`}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
