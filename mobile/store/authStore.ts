import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { IUser } from "@/types/types";

type State = {
  user: IUser | null;
  token: string | null;
};

type Action = {
  setUser: (user: any) => void;
  setToken: (token: string) => void;
};

export const useAuth = create(
  persist<State & Action>(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
