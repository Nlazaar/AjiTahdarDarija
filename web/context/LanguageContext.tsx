'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

type LanguageContextType = {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  t: any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLang, setSelectedLang] = useState('fr');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darija_lang');
    if (saved) {
      setSelectedLang(saved);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('darija_lang', selectedLang);
    }
  }, [selectedLang, isLoaded]);

  const t = translations[selectedLang] || translations.fr;

  return (
    <LanguageContext.Provider value={{ selectedLang, setSelectedLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
