import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    full_name?: string;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-user",
    }
  )
);
