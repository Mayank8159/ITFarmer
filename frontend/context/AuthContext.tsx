"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  login: (token: string, username?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored credentials on mount
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    
    if (token) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
  }, []);

  const login = (token: string, username?: string) => {
    localStorage.setItem("token", token);
    if (username) {
      localStorage.setItem("username", username);
      setUser(username);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);