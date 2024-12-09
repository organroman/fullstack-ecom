import { ReactNode } from "react";

import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Select, SelectTrigger, SelectValue } from "../ui/select";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  selectContent: ReactNode;
};

const UseFormSelect = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  selectContent,
}: FormInputProps<T>) => {
  console.log(control._defaultValues);
  console.log(control._fields);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Make your choice"} />
              </SelectTrigger>
            </FormControl>
            {selectContent}
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UseFormSelect;
