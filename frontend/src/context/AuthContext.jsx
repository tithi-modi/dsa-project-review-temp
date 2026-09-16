import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "dairy_coop_auth";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Pass loadStored function reference for lazy initialization (runs once on mount)
  const [auth, setAuth] = useState(loadStored);

  /**
   * Supports both usage signatures:
   * 1. login("FARMER", { farmerId: "FARM-001", name: "Zackary" })
   * 2. login({ role: "FARMER", farmerId: "FARM-001", name: "Zackary" })
   */
  const login = (roleOrData, userData = {}) => {
    let next;
    if (typeof roleOrData === "object" && roleOrData !== null) {
      next = roleOrData;
    } else {
      next = { role: roleOrData, ...userData };
    }

    setAuth(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}