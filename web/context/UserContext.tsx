'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type AuthUser, getStoredUser, clearAuth } from '@/lib/auth';

type UserContextType = {
  /* Mascot & display name (onboarding) */
  mascot:      string;
  setMascot:   (mascot: string) => void;
  userName:    string;
  setUserName: (name: string) => void;
  /* Auth */
  user:        AuthUser | null;
  setUser:     (user: AuthUser | null) => void;
  logout:      () => void;
  isLoggedIn:  boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [mascot,    setMascotState]   = useState<string>('/images/maroccan-lion.png');
  const [userName,  setUserNameState] = useState<string>('');
  const [user,      setUserState]     = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedMascot = localStorage.getItem('darija_mascot');
    const savedName   = localStorage.getItem('darija_username');
    if (savedMascot) setMascotState(savedMascot);
    if (savedName)   setUserNameState(savedName);
    const storedUser = getStoredUser();
    if (storedUser)  setUserState(storedUser);
  }, []);

  const setMascot = (m: string) => {
    setMascotState(m);
    localStorage.setItem('darija_mascot', m);
  };

  const setUserName = (n: string) => {
    setUserNameState(n);
    localStorage.setItem('darija_username', n);
  };

  const setUser = useCallback((u: AuthUser | null) => setUserState(u), []);

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
  }, []);

  return (
    <UserContext.Provider value={{
      mascot, setMascot,
      userName, setUserName,
      user, setUser, logout,
      isLoggedIn: !!user,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
