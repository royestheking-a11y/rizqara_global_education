import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "advisor";
  phone?: string;
  country?: string;
  educationLevel?: string;
  gpa?: string;
  targetDegree?: string;
  targetCountry?: string;
  targetSubject?: string;
  ieltsStatus?: string;
  budget?: string;
  passportStatus?: string;
  preferredIntake?: string;
  profileCompletion?: number;
  savedScholarships?: string[];
  documents?: Record<string, string>;
  payments?: any[];
  notifications?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (userData: any) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<any>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const profile = await api.get('/auth/profile');
      setUser(profile);
    } catch (err: any) {
      console.error("Profile refresh failed", err);
      // Only logout if it's an authentication error
      if (err.status === 401 || err.message?.includes("401")) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true, message: "Welcome back!", user: response.user };
    } catch (err: any) {
      return { success: false, message: err.message || "Invalid credentials" };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true, message: "Account created!", user: response.user };
    } catch (err: any) {
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await api.put('/auth/profile', updates);
      setUser(updated);
      return { success: true, user: updated };
    } catch (err) {
      console.error("Profile update failed", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      isAdmin: user?.role === "admin",
      login, 
      register, 
      logout, 
      updateProfile, 
      refreshProfile,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
