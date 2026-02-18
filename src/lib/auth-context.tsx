"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "./api";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: {
    user_id: string;
    username: string;
    email: string;
  } | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const checkAuth = useCallback(async () => {
    const token = api.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const result = await api.checkAdmin();
    if (result.data) {
      setIsAuthenticated(true);
      setIsAdmin(result.data.is_admin_effective);
      setUser({
        user_id: result.data.user_id,
        username: result.data.username,
        email: result.data.email,
      });
    } else {
      api.setToken(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    const result = await api.login(username, password);
    if (result.error) {
      return { success: false, error: result.error };
    }

    // Check if user is admin
    const adminCheck = await api.checkAdmin();
    if (adminCheck.data) {
      setIsAuthenticated(true);
      setIsAdmin(adminCheck.data.is_admin_effective);
      setUser({
        user_id: adminCheck.data.user_id,
        username: adminCheck.data.username,
        email: adminCheck.data.email,
      });

      if (!adminCheck.data.is_admin_effective) {
        return { success: false, error: "Admin access required" };
      }
      return { success: true };
    }

    return { success: false, error: "Failed to verify admin status" };
  };

  const logout = () => {
    api.setToken(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
