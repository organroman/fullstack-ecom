
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { capitalizeFirstLetter } from "@/lib/utils";
import { Category } from "@/types/types";


interface OrdersFilterProps {
  selectedCategory: Category | { name: string; id: string };
  onFilterChange: (categoryId: string) => void;
  categories: Category[];
}

const ProductsFilter = ({
  selectedCategory,
  onFilterChange,
  categories,
}: OrdersFilterProps) => {

  const categoriesWithAllOption = [{ name: "All", id: "all" }, ...categories];

  return (
    <Select
      value={selectedCategory.id.toString()}
      onValueChange={onFilterChange}
    >
      <SelectTrigger className="w-[180px]">
        {selectedCategory.name === "All"
          ? "Select a category"
          : capitalizeFirstLetter(selectedCategory.name)}
      </SelectTrigger>

      <SelectContent>
        {categoriesWithAllOption.map(
          (category: Category | { name: string; id: string }) => (
            <SelectItem value={category.id.toString()} key={category.id}>
              {capitalizeFirstLetter(category.name)}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

export default ProductsFilter;
