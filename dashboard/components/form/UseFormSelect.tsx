import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { capitalizeFirstLetter } from "@/lib/utils";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>; 
  label?: string;
  placeholder?: string;
  control: Control<T>;
  selectItems: string[];
};

const UseFormSelect = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  selectItems,
}: FormInputProps<T>) => (
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
          <SelectContent>
            {selectItems.map((item) => (
              <SelectItem key={item} value={item}>
                {capitalizeFirstLetter(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default UseFormSelect;
