"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedUsers } from "@/data/users";
import { KEYS, loadItem, saveItem, removeItem } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const AuthContext = createContext(null);

// DEMO AUTH ONLY: passwords are stored in plain text in LocalStorage.
export function AuthProvider({ children }) {
  const [users, setUsers] = useState(seedUsers);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUsers(loadItem(KEYS.users, seedUsers));
    setUserId(loadItem(KEYS.session, null));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveItem(KEYS.users, users);
  }, [users, ready]);

  useEffect(() => {
    if (!ready) return;
    userId ? saveItem(KEYS.session, userId) : removeItem(KEYS.session);
  }, [userId, ready]);

  const user = useMemo(() => {
    const found = users.find((u) => u.id === userId);
    if (!found) return null;
    const { password, ...safe } = found;
    return safe;
  }, [users, userId]);

  const login = useCallback(
    (email, password) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!found) return { ok: false, error: "Invalid email or password." };
      setUserId(found.id);
      return { ok: true, user: found };
    },
    [users]
  );

  const register = useCallback(
    ({ name, email, password, role }) => {
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const newUser = {
        id: generateId(role === "freelancer" ? "f" : "c"),
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}`,
      };
      setUsers((prev) => [...prev, newUser]);
      setUserId(newUser.id);
      return { ok: true, user: newUser };
    },
    [users]
  );

  const logout = useCallback(() => setUserId(null), []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}