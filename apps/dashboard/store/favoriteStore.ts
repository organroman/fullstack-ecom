import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { FavoriteItem, Product } from "@/types/types";

type State = {
  items: FavoriteItem[];
};

type Action = {
  toggleProduct: (product: Product) => void;
};

export const useFavorite = create(
  persist<State & Action>(
    (set) => ({
      items: [],
      toggleProduct: (product) => {
        set((state) => {
          const currentItemIndex = state.items.findIndex(
            (i) => i.product.id === product.id
          );

          if (currentItemIndex !== -1) {
            const updatedItems = state.items.filter(
              (i) => i.product.id !== product.id
            );
            return { items: updatedItems };
          } else {
            const updatedItems = [...state.items, { product }];

            return { items: updatedItems };
          }
        });
      },
    }),
    {
      name: "favorites-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
