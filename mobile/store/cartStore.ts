import { Product } from "@/types/product";
import { create } from "zustand";

type ProductItem = {
  product: Product;
  quantity: number;
};

type State = {
  items: ProductItem[];
};

type Action = {
  addProduct: (product: Product) => void;
  resetCart: () => void;
};

const useCart = create<State & Action>((set) => ({
  items: [],

  addProduct: (product: Product) =>
    set((state) => ({
      items: [...state.items, { product, quantity: 1 }],
    })),

  resetCart: () => set({ items: [] }),
}));

export default useCart;
