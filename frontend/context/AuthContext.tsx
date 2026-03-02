"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  isAdmin: boolean;
  login: (token: string, username?: string, isAdmin?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored credentials on mount
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const storedAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (token) {
      setIsLoggedIn(true);
      setUser(storedUser);
      setIsAdmin(storedAdmin);
    }
  }, []);

  const login = (token: string, username?: string, admin?: boolean) => {
    localStorage.setItem("token", token);
    if (username) {
      localStorage.setItem("username", username);
      setUser(username);
    }
    if (admin !== undefined) {
      localStorage.setItem("isAdmin", admin ? "true" : "false");
      setIsAdmin(admin);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);