import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Product } from "@/types/types";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ProductSelectorProps {
  selectedProduct: Product | null;
  handleSelectProduct: (id: string) => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  isPending: boolean;
  error: Error | null;
  allProducts: Product[];
  handleSave: () => void;
}

const ProductSelector = ({
  selectedProduct,
  handleSelectProduct,
  search,
  setSearch,
  isLoading,
  error,
  allProducts,
  isPending,
  handleSave,
}: ProductSelectorProps) => {
  return (
    <Modal
      title="Update order"
      descriptionFirst="Add product to the order and save"
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      isPending={isPending}
      action={handleSave}
    >
      <Select
        value={selectedProduct?.id.toString()}
        onValueChange={(id: string) => handleSelectProduct(id)}
      >
        <SelectTrigger className="w-full">
          {selectedProduct ? selectedProduct.name : "Select product"}
        </SelectTrigger>
        <SelectContent className="overflow-y-auto max-h-60 w-full max-w-full">
          <div className="z-10 p-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              placeholder="Search for product"
              className="bg-zinc-700"
            />
          </div>
          {isLoading && (
            <Loader className="size-6 animate-spin text-blue-500 mt-2 mx-auto" />
          )}
          {error && (
            <p className="text-red-500 font-semibold">{error.message}</p>
          )}
          {allProducts.length === 0 && (
            <p className="mb-4 text-center">Product not found</p>
          )}
          {allProducts.map((product) => (
            <SelectItem
              key={product.id}
              value={product.id.toString()}
              className="truncate w-full max-w-sm"
            >
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Modal>
  );
};

export default ProductSelector;
