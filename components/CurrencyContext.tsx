"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatBudget: (usdStr: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("nf_currency") as Currency | null;
    if (saved === "USD" || saved === "INR") {
      setCurrency(saved);
    }
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => {
      const next = prev === "USD" ? "INR" : "USD";
      localStorage.setItem("nf_currency", next);
      return next;
    });
  };

  // Helper function to format hardcoded USD tier strings into INR strings
  const formatBudget = (usdStr: string) => {
    if (currency === "USD") return usdStr;
    
    // Exact mapping for the specific tiers we use
    if (usdStr === "< $2,500") return "< ₹2,00,000";
    if (usdStr === "$2,500 - $7,500") return "₹2,00,000 - ₹6,00,000";
    if (usdStr === "$7,500 - $15,000+") return "₹6,00,000 - ₹12,00,000+";
    
    return usdStr; // fallback
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatBudget }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
