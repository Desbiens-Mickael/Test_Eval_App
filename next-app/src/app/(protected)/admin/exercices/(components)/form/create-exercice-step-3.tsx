"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  ClipboardList,
  FileText,
  Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { ComponentType, DynamicComponent } from "./dynamic-content-components";

interface CreateEXerciceSTep3Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  type: ComponentType;
  level: string;
}

export default function CreateEXerciceSTep3({
  form,
  type,
  level,
}: CreateEXerciceSTep3Props) {
  const content = form.getValues("content");

  const ContentCardForm = dynamic(
    () => import("./exerciceType/content-card/content-card-form"),
    { ssr: false }
  );

  const TrueFalseForm = dynamic(
    () =>
      import("./exerciceType/content-true-or-false/content-true-or-false-form"),
    { ssr: false }
  );

  // Vérification et assertion du type de contenu
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
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-semibold tracking-tight">
            {"Récapitulatif de l'exercice"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {
            "Vérifiez les informations avant de finaliser la création de votre exercice"
          }
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Carte d'information principale */}
        <Card className="">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>{"Détails de l'exercice"}</CardTitle>
            </div>
            <CardDescription>
              Informations générales et configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{form.getValues("title")}</h3>
              <p className="text-muted-foreground">
                {form.getValues("description")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  <span>{"Type d'exercice"}</span>
                </div>
                <div className="font-medium">
                  <Badge variant="outline" className="text-sm">
                    {type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  <span>Niveau de difficulté</span>
                </div>
                <div className="font-medium">
                  <Badge variant="outline" className="text-sm">
                    {level}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aperçu du contenu */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <CardTitle>{"Aperçu du contenu"}</CardTitle>
            </div>
            <CardDescription>{"Visualisation de l'exercice"}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="p-4 border rounded-lg bg-background">
              <DynamicComponent
                initialValue={content}
                type={type}
                isEditing={false}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 pt-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                {
                  "Vérifiez que toutes les informations sont correctes avant de finaliser la création de l'exercice."
                }
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
