"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { trueOrFalseInput } from "@/shema-zod/exercice.shema";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

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
  }, [content, onChange]);

  useEffect(() => {
    if (!initialValue?.length) {
      setContent(defaultContent);
    }
  }, [initialValue]);

  const handleAddContent = () => {
    setContent((prev) => [{ question: "", answer: false }, ...(prev ?? [])]);
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

  const handleRemoveQuestion = (index: number) => {
    setContent((prev) => prev?.filter((_, i) => i !== index) ?? []);
  };

  return (
    <div className="space-y-6">
      {isEditing ? (
        <>
          <motion.div
            layout
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              type="button"
              variant={"outline"}
              className="border-dashed gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleAddContent}
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter une question
            </Button>
          </motion.div>

          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {content?.map((question, index) => (
                <motion.div
                  key={index}
                  layout
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "relative group flex flex-col gap-4 p-5 bg-card rounded-lg border border-border",
                    "transition-all duration-200 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Textarea
                      placeholder="Saisissez votre question..."
                      value={question.question}
                      className="min-h-[80px] resize-none border-none bg-transparent text-base font-medium shadow-none p-1 "
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    {content.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-opacity delay-200"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer la question</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant={question.answer ? "default" : "outline"}
                      className={cn(
                        "gap-2 transition-all",
                        question.answer ? "pl-3 pr-4" : "px-4"
                      )}
                      onClick={() => handleChecked(index, true)}
                    >
                      {question.answer && <Check className="h-4 w-4" />}
                      Vrai
                    </Button>
                    <Button
                      type="button"
                      variant={!question.answer ? "default" : "outline"}
                      className={cn(
                        "gap-2 transition-all",
                        !question.answer ? "pl-3 pr-4" : "px-4"
                      )}
                      onClick={() => handleChecked(index, false)}
                    >
                      {!question.answer && <X className="h-4 w-4" />}
                      Faux
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {content?.map((question, index) => (
              <motion.div
                key={index}
                layout
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                className="rounded-lg border bg-card p-5 shadow-sm"
              >
                <div className="space-y-3">
                  <h4 className="text-base font-medium leading-none">
                    {question.question || "Question sans titre"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        question.answer
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      {question.answer ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Réponse : {question.answer ? "Vrai" : "Faux"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
