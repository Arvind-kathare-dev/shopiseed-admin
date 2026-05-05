import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { useAuthStore, type User } from "./store";

type Session = {
  user: User;
  access_token: string;
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: storeUser, token: storeToken, setUser: setStoreUser, setToken: setStoreToken, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // The store automatically rehydrates from localStorage due to 'persist' middleware.
    // We just need to signal that we've checked the session.
    setLoading(false);
  }, []);

  const value: AuthCtx = {
    user: storeUser,
    session: storeUser && storeToken ? { user: storeUser, access_token: storeToken } : null,
    loading,
    signIn: async (email, password) => {
      try {
        const response = (await api.login(email, password)) as any;
        const userData = response.user || response;
        const access_token = response.access_token || response.token;

        localStorage.setItem("auth_token", access_token);
        setStoreUser(userData);
        setStoreToken(access_token);
        return {};
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    },
    signUp: async (email, password, name) => {
      try {
        const response = (await api.signup(email, password, name)) as any;
        const userData = response.user || response;
        const access_token = response.access_token || response.token;

        localStorage.setItem("auth_token", access_token);
        setStoreUser(userData);
        setStoreToken(access_token);
        return {};
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Signup failed",
        };
      }
    },
    signInWithGoogle: async () => {
      return {
        error: "Google sign-in not yet configured",
      };
    },
    signOut: async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          await api.logout(token);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }

      localStorage.removeItem("auth_token");
      storeLogout();
    },
    resetPassword: async (email) => {
      try {
        await api.forgotPassword(email);
        return {};
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Password reset failed",
        };
      }
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
