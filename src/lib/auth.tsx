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
  const { setUser: setStoreUser, setToken: setStoreToken, logout: storeLogout } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          // Explicitly fetch fresh user info from /api/auth/me
          const response = (await api.getCurrentUser(token)) as any;
          
          // API might return { data: user } or { user: { ... } } or { ...user }
          const userData = response.data || response.user || response;
          
          if (userData && (userData.email || userData._id || userData.id)) {
            setUser(userData);
            setStoreUser(userData);
            setStoreToken(token);
            setSession({
              user: userData,
              access_token: token,
            });
          } else {
            throw new Error("Invalid user data");
          }
        } catch (error) {
          console.error("Auth sync failed:", error);
          // Only clear if it's a 401/403 style error, but for simplicity we clear on any fail
          localStorage.removeItem("auth_token");
          storeLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [setStoreUser, setStoreToken, storeLogout]);

  const value: AuthCtx = {
    user,
    session,
    loading,
    signIn: async (email, password) => {
      try {
        const response = (await api.login(email, password)) as any;
        // Handle both { user: { ... } } and direct { ... } structures
        const userData = response.user || response;
        const access_token = response.access_token || response.token;

        localStorage.setItem("auth_token", access_token);
        setStoreUser(userData);
        setStoreToken(access_token);
        setSession({
          user: userData,
          access_token,
        });
        setUser(userData);
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
        // Handle both { user: { ... } } and direct { ... } structures
        const userData = response.user || response;
        const access_token = response.access_token || response.token;

        localStorage.setItem("auth_token", access_token);
        setStoreUser(userData);
        setStoreToken(access_token);
        setSession({
          user: userData,
          access_token,
        });
        setUser(userData);
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
      setSession(null);
      setUser(null);
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
