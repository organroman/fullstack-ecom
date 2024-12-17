import { create } from "zustand";

import { ICartItem, Product } from "@/types/types";

type State = {
  items: ICartItem[];
};

type Action = {
  addProduct: (product: Product) => void;
  resetCart: () => void;
  increaseProductQuantity: (item: ICartItem) => void;
  decreaseProductQuantity: (item: ICartItem) => void;
  deleteProduct: (product: Product) => void;
};

const useCart = create<State & Action>((set) => ({
  items: [],

  addProduct: (product: Product) =>
    set((state) => {
      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  resetCart: () => set({ items: [] }),

  increaseProductQuantity: (item: ICartItem) =>
    set((state) => {
      const currentItemIndex = state.items.findIndex(
        (i) => i.product.id === item.product.id
      );
      console.log("🚀 ~ currentItemIndex:", currentItemIndex);

      const updatedItems = state.items.map((i, index) =>
        index == currentItemIndex ? { ...i, quantity: i.quantity + 1 } : item
      );
      return { items: updatedItems };
    }),

  decreaseProductQuantity: (item: ICartItem) =>
    set((state) => {
      const currentItemIndex = state.items.findIndex(
        (i) => i.product.id === item.product.id
      );

      const updatedItems = state.items.map((i, index) =>
        index == currentItemIndex ? { ...i, quantity: item.quantity - 1 } : item
      );
      return { items: updatedItems };
    }),
  deleteProduct: (product: Product) =>
    set((state) => {
      const updatedItems = state.items.filter(
        (i) => i.product.id !== product.id
      );
      return { items: updatedItems };
    }),
}));

export default useCart;
