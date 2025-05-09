import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type ColorVariant = 'warning' | 'danger' | 'info' | 'success' | 'default';

interface ConstructionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  variant?: ColorVariant;
  icon?: ReactNode;
  action?: ReactNode;
}

const colorVariants: Record<ColorVariant, string> = {
  warning: "border-orange-500 from-orange-50 text-orange-700 dark:from-orange-900/30 dark:border-orange-700",
  danger: "border-red-500 from-red-50 text-red-700 dark:from-red-900/30 dark:border-red-700",
  info: "border-blue-500 from-blue-50 text-blue-700 dark:from-blue-900/30 dark:border-blue-700",
  success: "border-green-500 from-green-50 text-green-700 dark:from-green-900/30 dark:border-green-700",
  default: "border-gray-500 from-gray-50 text-gray-700 dark:from-gray-900/30 dark:border-gray-700"
};

export function ConstructionPanel({
  className,
  title = "Fonctionnalité en développement",
  message = "Revenez plus tard !",
  variant = 'warning',
  icon,
  action,
  ...props
}: ConstructionPanelProps) {
  return (
    <Alert
      variant="default"
      className={cn(
        `relative overflow-hidden rounded-xl border-l-4 bg-gradient-to-r to-transparent p-4 shadow-md transition-all duration-300 hover:shadow-lg w-full max-w-md mx-auto group ${colorVariants[variant]}`,
        className
      )}
      {...props}
    >
      <div className={`absolute inset-y-0 left-0 w-1 bg-${variant}-500 dark:bg-${variant}-700 group-hover:w-2 transition-all duration-300`} />
      <AlertTitle className={`flex items-center gap-3 mb-2 text-lg font-semibold text-${variant}-700 dark:text-${variant}-300`}>
        {icon || (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 animate-pulse" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        )}
        {title}
      </AlertTitle>
      <AlertDescription className={`flex items-center justify-between space-x-3 text-${variant}-600 dark:text-${variant}-200`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full border-b-2 border-blue-500 h-5 w-5" />
          <div className="flex items-center">
            <span className="mr-2 text-xl">🛠️</span>
            <p className="text-md">{message}</p>
            <span className="ml-2 text-xl">🛠️</span>
          </div>
        </div>
        {action && <div className="ml-auto">{action}</div>}
      </AlertDescription>
    </Alert>
  );
}
