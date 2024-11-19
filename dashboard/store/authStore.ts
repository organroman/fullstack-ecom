import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { IUser } from "@/types/types";


type State = {
  user: IUser | null;
  token: string | null;
  isHydrated: boolean;
};

type Action = {
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
};

export const useAuth = create(
  persist<State & Action>(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-store",
      // storage: createJSONStorage(() =>
      //   typeof window !== "undefined" ? localStorage : memoryStorage
      // ),
    }
  )
);
