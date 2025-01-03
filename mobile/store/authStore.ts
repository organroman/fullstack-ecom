import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { User } from "@/types/types";

type State = {
  user: User | null;
  token: string | null;
};

type Action = {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  removeUser: () => void;
  removeToken: () => void;
};

export const useAuth = create(
  persist<State & Action>(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      removeUser: () => set({ user: null }),
      removeToken: () => set({ token: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
