import { container, item } from "@/animations/exercice-resulte-true-or-false";
import { trueOrFalseResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentTrueOrFalseInput } from "@/shema-zod/exercice.shema";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface ExerciceResultTrueOrFalseProps {
  content: contentTrueOrFalseInput;
  response: trueOrFalseResponseType;
}

export default function ExerciceResultTrueOrFalse({
  content,
  response,
}: ExerciceResultTrueOrFalseProps) {
  return (
    <motion.div
      className="bg-card rounded-2xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto border border-border"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <AnimatePresence>
        {content.map((question, index) => {
          const isCorrect = response[index]?.answer === question.answer;
          const userAnswer = response[index]?.answer;
          const correctAnswer = question.answer;

          return (
            <motion.div
              key={index}
              variants={item}
              className="bg-muted/30 p-5 rounded-xl border border-border transition-colors duration-200"
            >
              {/* Question */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <p className="text-sm sm:text-base font-medium text-foreground/90 leading-relaxed">
                  {question.question}
                </p>
                <motion.div
                  className={isCorrect ? "text-success" : "text-destructive"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  {isCorrect ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      <span>Incorrect</span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Reponse */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.div
                  className={`
                    p-3 rounded-lg border flex items-center gap-2
                    ${
                      userAnswer === true
                        ? isCorrect
                          ? "bg-success/10 border-success/20 text-success"
                          : "bg-destructive/5 border-destructive/20 text-destructive"
                        : correctAnswer === true
                        ? "bg-success/10 border-success/20 text-success"
                        : "bg-muted/30 border-border/40"
                    }
                  `}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      userAnswer === true
                        ? isCorrect
                          ? "bg-success/10 border-success/20 text-success"
                          : "bg-destructive/10 border-destructive/20 text-destructive"
                        : correctAnswer === true
                        ? "bg-success/10 border-success/20 text-success"
                        : "bg-muted text-muted-foreground/50"
                    }`}
                  >
                    {userAnswer === true ? (
                      isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )
                    ) : correctAnswer === true ? (
                      <div className="w-2 h-2 rounded-full bg-success" />
                    ) : null}
                  </div>
                  <span
                    className={`font-medium ${
                      userAnswer === true && !isCorrect ? "line-through" : ""
                    }`}
                  >
                    Vrai
                  </span>
                </motion.div>

                {/* Reponse correcte */}
                <motion.div
                  className={`
                    p-3 rounded-lg border flex items-center gap-2
                    ${
                      userAnswer === false
                        ? isCorrect
                          ? "bg-success/10 border-success/20 text-success"
                          : "bg-destructive/5 border-destructive/20 text-destructive"
                        : correctAnswer === false
                        ? "bg-success/10 border-success/20 text-success"
                        : "bg-muted/30 border-border/40 text-muted-foreground"
                    }
                  `}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      userAnswer === false
                        ? isCorrect
                          ? "bg-success/10 border-success/20 text-success"
                          : "bg-destructive/10 border-destructive/20 text-destructive"
                        : correctAnswer === false
                        ? "bg-success/10 border-success/20 text-success"
                        : "bg-muted text-muted-foreground/50"
                    }`}
                  >
                    {userAnswer === false ? (
                      isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )
                    ) : correctAnswer === false ? (
                      <div className="w-2 h-2 rounded-full bg-success" />
                    ) : null}
                  </div>
                  <span
                    className={`font-medium ${
                      userAnswer === false && !isCorrect ? "line-through" : ""
                    }`}
                  >
                    Faux
                  </span>
                </motion.div>
              </div>

              {!isCorrect && (
                <motion.div
                  className="mt-3 text-sm text-muted-foreground flex items-start gap-2 bg-muted/30 dark:bg-muted/20 px-3 py-2 rounded-lg"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-amber-500 dark:text-amber-400 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-lightbulb"
                    >
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1 1.3 1.2 2" />
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                    </svg>
                  </span>
                  <span>
                    La bonne réponse était :{" "}
                    <span className="font-medium text-foreground/90">
                      {correctAnswer ? "Vrai" : "Faux"}
                    </span>
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
