"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { authStorage } from "../libs/auth-storage";
import { getSocket, reconnectSocketWithAuth } from "../libs/socket";
import type { Driver, LoginPayload } from "../libs/types";

interface AuthContextValue {
  loading: boolean;
  accessToken: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  nameOfDriver: string | null;
  driverId: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    authStorage.getAccessToken(),
  );
  const [nameOfDriver, setNameOfDriver] = useState<string | null>(
    authStorage.getDriverName(),
  );
  const [loading, setLoading] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverId, setDriverId] = useState(authStorage.getDriverId());

  async function login(payload: LoginPayload) {
    const res = await authApi.login(payload);
    authStorage.set(res.accessToken, res?.driver?.name, String(res?.driver?.id));
    setNameOfDriver(res.driver.name);
    setDriverId(String(res.driver.id));
    setAccessToken(res.accessToken);
    reconnectSocketWithAuth();
  }

  function logout() {
    getSocket().disconnect();
    authStorage.clear();
    setAccessToken(null);
    setDriver(null);
    window.location.href = "/login";
  }

  useEffect(() => {
    if (!accessToken) return;

    reconnectSocketWithAuth();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ nameOfDriver, accessToken, loading, login, logout, driverId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/**
 * Wrap any page that requires a logged-in driver. Redirects to /login once
 * hydration finishes and there's no driver in storage.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) router.replace("/login");
  }, [loading, accessToken, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutralText">
        Loading…
      </div>
    );
  }

  if (!accessToken) return null;

  return <>{children}</>;
}
