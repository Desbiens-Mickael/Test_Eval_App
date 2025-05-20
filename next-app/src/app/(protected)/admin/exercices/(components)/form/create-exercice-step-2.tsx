"use client";

import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { ComponentType, DynamicComponent } from "./dynamic-content-components";

interface CreateExerciceStep2Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  type: ComponentType;
}

export default function CreateExerciceStep2({
  form,
  type,
}: CreateExerciceStep2Props) {
  // Vérifie s'il y a des erreurs de validation
  const hasErrors = form.formState.errors.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="h-full space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Configuration du contenu
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {`Définissez le contenu de votre exercice de type : ${type}`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Contenu de l'exercice
          </CardTitle>
          <CardDescription>
            Configurez le contenu spécifique à votre type d'exercice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Contenu de l'exercice
                </FormLabel>
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="content"
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <DynamicComponent
                          type={type}
                          initialValue={field.value}
                          onChange={(newContent) => {
                            field.onChange(newContent);
                          }}
                        />
                        {fieldState.error && (
                          <p className="text-sm font-medium text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Veuillez corriger les erreurs dans le formulaire avant de continuer.
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
}
