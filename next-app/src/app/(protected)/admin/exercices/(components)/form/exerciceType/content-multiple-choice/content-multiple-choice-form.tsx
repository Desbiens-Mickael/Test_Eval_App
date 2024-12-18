"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Answers = [
  { answer: string; isCorrect: boolean },
  ...{ answer: string; isCorrect: boolean }[]
];

const defaultQuestion: multipleChoiceInput = {
  question: "",
  answers: [
    { answer: "", isCorrect: false },
    { answer: "", isCorrect: false },
  ],
};

const defaultValue: multipleChoiceInput[] = [defaultQuestion];

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
  const [content, setContent] = useState<multipleChoiceInput[]>(
    initialValue ?? []
  );

  useEffect(() => {
    if (onChange) {
      onChange(content ?? []);
    }
  }, [content]);

  useEffect(() => {
    if (!initialValue?.length) {
      setContent(defaultValue);
    }
  }, [initialValue]);

  const handleAddContent = () => {
    setContent((prev) => [...(prev ?? []), defaultQuestion]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    setContent(
      (prev) =>
        prev?.map((q, i) => (i === index ? { ...q, question: value } : q)) ?? []
    );
  };

  const handleDeleteContent = (index: number) => {
    setContent((prev) => prev?.filter((_, i) => i !== index) ?? []);
  };

  const handleAddAnswer = (questionIndex: number) => {
    setContent(
      (prev) =>
        prev?.map((q, i) =>
          i === questionIndex
            ? {
                ...q,
                answers: [...q.answers, { answer: "", isCorrect: false }],
              }
            : q
        ) ?? []
    );
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    setContent(
      (prev) =>
        prev?.map((q, i) =>
          i === questionIndex
            ? {
                ...q,
                answers: q.answers.map((a, j) =>
                  j === answerIndex ? { ...a, answer: value } : a
                ) as Answers,
              }
            : q
        ) ?? []
    );
  };

  const handleCorrectChange = (
    questionIndex: number,
    answerIndex: number,
    value: boolean
  ) => {
    setContent(
      (prev) =>
        prev?.map((q, i) =>
          i === questionIndex
            ? {
                ...q,
                answers: q.answers.map((a, j) =>
                  j === answerIndex ? { ...a, isCorrect: value } : a
                ) as Answers,
              }
            : q
        ) ?? []
    );
  };

  const handleDeleteAnswer = (questionIndex: number, answerIndex: number) => {
    setContent(
      (prev) =>
        prev?.map((q, i) =>
          i === questionIndex
            ? {
                ...q,
                answers: q.answers.filter(
                  (_, j) => j !== answerIndex
                ) as Answers,
              }
            : q
        ) ?? []
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {isEditing ? (
        <>
          <div className="w-full flex justify-center items-end gap-2">
            <div className="flex flex-col">
              <Button
                size="sm"
                onClick={handleAddContent}
                className="w-full"
                type="button"
              >
                Ajouter une question
              </Button>
            </div>
          </div>

          {content.map((question, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-dashed border-primary-200 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <Label className="text-lg" htmlFor={`question-${index}`}>
                  Question {index + 1}
                </Label>
                <Button
                  type="button"
                  className="size-fit p-1 ms-2 text-destructive bg-transparent hover:bg-destructive/30 hover:text-destructive focus:text-destructive transition-colors"
                  onClick={() => {
                    handleDeleteContent(index);
                  }}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
              <div className="flex item-center gap-2">
                <Input
                  id={`question-${index}`}
                  type="text"
                  placeholder="Entrez la question"
                  value={question.question}
                  onChange={(e) => {
                    handleQuestionChange(index, e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col gap-4 border border-slate-200 p-4 rounded-lg ms-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold">Reponses</h3>
                  <Button
                    type="button"
                    className="size-fit p-1"
                    onClick={() => {
                      handleAddAnswer(index);
                    }}
                  >
                    <Plus size={20} />
                  </Button>
                </div>
                {question.answers.map((answer, answerIndex) => (
                  <div className="flex gap-4">
                    <div key={answerIndex} className="flex flex-col gap-2 grow">
                      <Label
                        className="mb-1"
                        htmlFor={`answer-${index}-${answerIndex}`}
                      >
                        Reponse {answerIndex + 1}
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="size-fit p-1 ms-2 text-destructive bg-transparent hover:bg-destructive/30 hover:text-destructive focus:text-destructive transition-colors"
                          onClick={() => {
                            handleDeleteAnswer(index, answerIndex);
                          }}
                        >
                          <X size={20} />
                        </Button>
                        <Input
                          id={`answer-${index}-${answerIndex}`}
                          type="text"
                          placeholder="Entrez la reponse"
                          value={answer.answer}
                          onChange={(e) => {
                            handleAnswerChange(
                              index,
                              answerIndex,
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label
                        className="mb-1"
                        htmlFor={`correct-${index}-${answerIndex}`}
                      >
                        Correct
                      </Label>
                      <div className="flex justify-center items-center grow pt-2">
                        <Switch
                          id={`correct-${index}-${answerIndex}`}
                          checked={answer.isCorrect}
                          onCheckedChange={(value) => {
                            handleCorrectChange(index, answerIndex, value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Réponses
          </h3>
          <div className="space-y-6">
            {content.map((question, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                  {question.question}
                </h4>
                <div className="space-y-3 ms-4">
                  {question.answers.map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={`p-3 rounded-md transition-colors duration-200 ${
                        answer.isCorrect
                          ? "bg-green-100 border-l-4 border-green-500"
                          : "bg-red-100 border-l-4 border-red-500"
                      }`}
                    >
                      <p className="text-gray-800 font-normal">
                        {answer.answer}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          answer.isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {answer.isCorrect
                          ? "Réponse Correcte"
                          : "Réponse Incorrecte"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
