import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>; // Ensures the name matches keys from the form schema
  label?: string;
  placeholder?: string;
  control: Control<T>; // Generic Control type for the form schema
  fieldType?: "input" | "textarea";
  type?: string;
  rows?: number;
};

const UseFormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  fieldType = "input",
  type = "text",
  rows,
}: FormInputProps<T>) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem className="space-y-0.5">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          {fieldType === "textarea" ? (
            <Textarea {...field} placeholder={placeholder} rows={rows} />
          ) : (
            <Input {...field} placeholder={placeholder} type={type} />
          )}
        </FormControl>
        <FormMessage className="text-xs" />
      </FormItem>
    )}
  />
);

export default UseFormInput;
