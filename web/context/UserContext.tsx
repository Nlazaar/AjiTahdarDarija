'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserContextType = {
  mascot: string;
  setMascot: (mascot: string) => void;
  userName: string;
  setUserName: (name: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [mascot, setMascotState] = useState<string>('/images/maroccan-lion.png');
  const [userName, setUserNameState] = useState<string>('');

  useEffect(() => {
    const savedMascot = localStorage.getItem('darija_mascot');
    const savedName = localStorage.getItem('darija_username');
    if (savedMascot) setMascotState(savedMascot);
    if (savedName) setUserNameState(savedName);
  }, []);

  const setMascot = (m: string) => {
    setMascotState(m);
    localStorage.setItem('darija_mascot', m);
  };

  const setUserName = (n: string) => {
    setUserNameState(n);
    localStorage.setItem('darija_username', n);
  };

  return (
    <UserContext.Provider value={{ mascot, setMascot, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
