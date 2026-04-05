import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth";
import type { User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeUser(user: User): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const me = await authApi.me();
        if (mounted) {
          setUser(normalizeUser(me));
        }
      } catch {
        localStorage.removeItem("accessToken");
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(input: { email: string; password: string }) {
    const payload = await authApi.login(input);
    localStorage.setItem("accessToken", payload.token);
    setUser(normalizeUser(payload.user));
  }

  async function register(input: { name: string; email: string; password: string }) {
    const payload = await authApi.register(input);
    localStorage.setItem("accessToken", payload.token);
    setUser(normalizeUser(payload.user));
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
