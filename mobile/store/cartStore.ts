import { create } from "zustand";

import { CartItem, Product } from "@/types/types";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type State = {
  items: CartItem[];
};

type Action = {
  addProduct: (product: Product) => void;
  resetCart: () => void;
  increaseProductQuantity: (item: CartItem) => void;
  decreaseProductQuantity: (item: CartItem) => void;
  deleteProduct: (product: Product) => void;
};

const useCart = create(
  persist<State & Action>(
    (set) => ({
      items: [],

      addProduct: (product: Product) =>
        set((state) => {
          return {
            items: [
              ...state.items,
              { product, quantity: 1, price: product.price },
            ],
          };
        }),

      resetCart: () => set({ items: [] }),

      increaseProductQuantity: (item: CartItem) =>
        set((state) => {
          const currentItemIndex = state.items.findIndex(
            (i) => i.product.id === item.product.id
          );

          const updatedItems = state.items.map((i, index) =>
            index == currentItemIndex
              ? { ...i, quantity: i.quantity + 1 }
              : item
          );
          return { items: updatedItems };
        }),

      decreaseProductQuantity: (item: CartItem) =>
        set((state) => {
          const currentItemIndex = state.items.findIndex(
            (i) => i.product.id === item.product.id
          );

          const updatedItems = state.items.map((i, index) =>
            index == currentItemIndex
              ? { ...i, quantity: item.quantity - 1 }
              : item
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
    }),
    { name: "cart-store", storage: createJSONStorage(() => AsyncStorage) }
  )
);

export default useCart;
