import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import type { User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  registerModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
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
  const queryClient = useQueryClient();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const hasToken = Boolean(localStorage.getItem("accessToken"));
  const authQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => normalizeUser(await authApi.me()),
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const user = authQuery.data ?? null;
  const loading = hasToken ? authQuery.isLoading : false;

  const login = useCallback(async (input: { email: string; password: string }) => {
    const payload = await authApi.login(input);
    localStorage.setItem("accessToken", payload.token);
    queryClient.setQueryData(["auth", "me"], normalizeUser(payload.user));
  }, [queryClient]);

  const register = useCallback(async (input: { name: string; email: string; password: string }) => {
    const payload = await authApi.register(input);
    localStorage.setItem("accessToken", payload.token);
    queryClient.setQueryData(["auth", "me"], normalizeUser(payload.user));
  }, [queryClient]);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const payload = await authApi.googleLogin(idToken);
    localStorage.setItem("accessToken", payload.token);
    queryClient.setQueryData(["auth", "me"], normalizeUser(payload.user));
  }, [queryClient]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.removeQueries({ queryKey: ["components"] });
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, logout, registerModalOpen, setRegisterModalOpen, loginModalOpen, setLoginModalOpen }),
    [user, loading, login, register, loginWithGoogle, logout, registerModalOpen, setRegisterModalOpen, loginModalOpen, setLoginModalOpen]
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
