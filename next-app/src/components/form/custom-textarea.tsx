import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface CustomTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  isRequired?: boolean;
}

export default function CustomTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  className,
  isRequired,
}: CustomTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={className}
              {...field}
            />
          </FormControl>
          <FormDescription className="text-xs">{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
