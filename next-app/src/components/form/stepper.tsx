"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4 px-2 mb-6">
      <div className="w-full flex items-center relative">
        <AnimatePresence>
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center  relative group ${
                index < steps.length - 1 ? "pr-4 flex-1" : ""
              }`}
            >
              {/* Step Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-8 right-0 top-1/2 -translate-y-1/2 h-0.5 transition-all duration-300 ease-in-out ${
                    index < currentStep - 1 ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}

              {/* Step Indicator */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: index + 1 === currentStep ? 1.1 : 1,
                  backgroundColor:
                    index + 1 <= currentStep
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))",
                  color: "white",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`
                  flex items-center justify-center 
                  size-10 rounded-full 
                  border-2 border-transparent
                  shadow-md
                  font-semibold
                  group-hover:shadow-lg
                  transition-all duration-300
                  z-10
                `}
              >
                {index + 1 < currentStep ? (
                  <Check size={24} />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Stepper;
