"use client";

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Check } from "lucide-react";
import React, { useEffect } from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 },
    });
  }, [currentStep, controls]);

  return (
    <div className="w-full py-6 px-2 mb-6">
      <div className="w-full flex items-center relative">
        <AnimatePresence mode="wait">
          {steps.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isActive = index + 1 === currentStep;

            return (
              <div
                key={step}
                className={`flex items-center relative group ${
                  index < steps.length - 1 ? "pr-4 flex-1" : ""
                }`}
              >
                {/* Step Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 right-0 top-1/2 -translate-y-1/2 h-1 overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        isCompleted ? "bg-primary" : "bg-secondary/30"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: isCompleted ? "100%" : "0%",
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                )}

                {/* Step Indicator */}
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    backgroundColor: isCompleted
                      ? "hsl(var(--primary))"
                      : isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))",
                    color:
                      isCompleted || isActive
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--secondary-foreground))",
                    boxShadow: isActive
                      ? "0 0 0 4px hsl(var(--primary)/0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`
                    flex items-center justify-center 
                    size-10 rounded-full 
                    border-2 border-transparent
                    font-semibold
                    cursor-pointer
                    relative
                    z-10
                    overflow-hidden
                  `}
                >
                  {/* Ripple Effect */}
                  <motion.span
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.5 : 0,
                      opacity: isActive ? 0 : 0,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />

                  {/* Checkmark or Number */}
                  <motion.span
                    key={isCompleted ? "check" : "number"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="relative z-10"
                  >
                    {isCompleted ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.span>

                  {/* Step Label */}
                  <motion.span
                    className={`absolute -bottom-7 whitespace-nowrap text-xs font-medium ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {step}
                  </motion.span>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Stepper;
