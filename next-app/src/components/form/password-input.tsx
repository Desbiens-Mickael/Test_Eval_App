"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { CustomInputProps } from "./custom-input";

export default function PasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold text-lg">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...field}
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-l-none absolute top-0 right-0"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}{" "}
              </Button>
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-xs ">
              {" "}
              {description}{" "}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
