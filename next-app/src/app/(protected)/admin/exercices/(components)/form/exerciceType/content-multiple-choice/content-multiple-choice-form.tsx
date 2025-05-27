"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import QuestionComponent from "./question-component";
import ShowPReviewMUltipleChoice from "./show-preview-multiple-choice";
import { useContentMultipleChoiceStore } from "./store/store-content-multiple-choice";

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
  }, [initialValue, onChange, setInitialValues]);

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
              onClick={addQuestion}
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter une question
            </Button>
          </motion.div>

          <AnimatePresence mode="popLayout">
            <div className="space-y-6">
              {content.map((question, index) => (
                <motion.div
                  key={`${index}`}
                  layout
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "relative group bg-card rounded-lg border border-border",
                    "transition-all duration-200 hover:shadow-md"
                  )}
                >
                  <QuestionComponent question={question} index={index} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {content.map((question, index) => (
              <motion.div
                key={`${index}`}
                layout
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <ShowPReviewMUltipleChoice content={[question]} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
