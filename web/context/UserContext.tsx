'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type AuthUser, getStoredUser, clearAuth, getToken } from '@/lib/auth';
import { getProfile, updateProfile } from '@/lib/api';

export type LangTrack = 'DARIJA' | 'MSA' | 'RELIGION';

const SHAPE_KEY = 'parcoursNodeShape';
const PATH_KEY  = 'parcoursPathStyle';

type UserContextType = {
  /* Mascot & display name (onboarding) */
  mascot:      string;
  setMascot:   (mascot: string) => void;
  userName:    string;
  setUserName: (name: string) => void;
  /* Language track */
  langTrack:    LangTrack;
  setLangTrack: (t: LangTrack) => void;
  /* Auth */
  user:        AuthUser | null;
  setUser:     (user: AuthUser | null) => void;
  logout:      () => void;
  isLoggedIn:  boolean;
  /* Pref helpers (sync backend) — pour la page apparence */
  setNodeShape: (s: string | null) => void;
  setPathStyle: (s: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Push fire-and-forget vers le backend (silencieux si pas loggé ou erreur réseau).
function pushPrefs(patch: Parameters<typeof updateProfile>[0]) {
  if (typeof window === 'undefined') return;
  if (!getToken()) return;
  updateProfile(patch).catch(() => {});
}

// Hydrate localStorage + state depuis le serveur quand on est loggé.
// Stratégie : SI le serveur a une valeur définie pour un champ, on l'écrit
// dans localStorage (server = source of truth pour les prefs sync).
// Émet un `storage` event pour que les hooks usePathStyle / pages /progress
// se mettent à jour sans reload.
function hydrateFromServer(opts: {
  setMascotState:    (m: string) => void;
  setLangTrackState: (t: LangTrack) => void;
}) {
  if (typeof window === 'undefined') return;
  if (!getToken()) return;
  getProfile()
    .then((profile: any) => {
      if (!profile) return;
      if (typeof profile.preferredMascot === 'string' && profile.preferredMascot) {
        localStorage.setItem('darija_mascot', profile.preferredMascot);
        opts.setMascotState(profile.preferredMascot);
      }
      if (profile.langTrack === 'DARIJA' || profile.langTrack === 'MSA' || profile.langTrack === 'RELIGION') {
        localStorage.setItem('darija_lang_track', profile.langTrack);
        opts.setLangTrackState(profile.langTrack);
      }
      if (typeof profile.nodeShape === 'string' && profile.nodeShape) {
        localStorage.setItem(SHAPE_KEY, profile.nodeShape);
        window.dispatchEvent(new StorageEvent('storage', { key: SHAPE_KEY, newValue: profile.nodeShape }));
      }
      if (typeof profile.pathStyle === 'string' && profile.pathStyle) {
        localStorage.setItem(PATH_KEY, profile.pathStyle);
        window.dispatchEvent(new StorageEvent('storage', { key: PATH_KEY, newValue: profile.pathStyle }));
      }
    })
    .catch(() => { /* offline ou token invalide → on garde localStorage */ });
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [mascot,    setMascotState]    = useState<string>('/images/maroccan-lion.png');
  const [userName,  setUserNameState]  = useState<string>('');
  const [langTrack, setLangTrackState] = useState<LangTrack>('DARIJA');
  const [user,      setUserState]      = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedMascot = localStorage.getItem('darija_mascot');
    const savedName   = localStorage.getItem('darija_username');
    const savedTrack  = localStorage.getItem('darija_lang_track');
    if (savedMascot) setMascotState(savedMascot);
    if (savedName)   setUserNameState(savedName);
    if (savedTrack === 'DARIJA' || savedTrack === 'MSA' || savedTrack === 'RELIGION') {
      setLangTrackState(savedTrack);
    }
    const storedUser = getStoredUser();
    if (storedUser) setUserState(storedUser);

    // Si l'user est déjà loggé au mount → hydrate les prefs depuis le serveur.
    hydrateFromServer({ setMascotState, setLangTrackState });
  }, []);

  const setMascot = (m: string) => {
    setMascotState(m);
    localStorage.setItem('darija_mascot', m);
    pushPrefs({ preferredMascot: m });
  };

  const setUserName = (n: string) => {
    setUserNameState(n);
    localStorage.setItem('darija_username', n);
    pushPrefs({ name: n });
  };

  const setLangTrack = (t: LangTrack) => {
    setLangTrackState(t);
    localStorage.setItem('darija_lang_track', t);
    pushPrefs({ langTrack: t });
  };

  const setNodeShape = (s: string | null) => {
    if (s) localStorage.setItem(SHAPE_KEY, s);
    else localStorage.removeItem(SHAPE_KEY);
    window.dispatchEvent(new StorageEvent('storage', { key: SHAPE_KEY, newValue: s ?? '' }));
    pushPrefs({ nodeShape: s });
  };

  const setPathStyle = (s: string | null) => {
    if (s) localStorage.setItem(PATH_KEY, s);
    else localStorage.removeItem(PATH_KEY);
    window.dispatchEvent(new StorageEvent('storage', { key: PATH_KEY, newValue: s ?? '' }));
    pushPrefs({ pathStyle: s });
  };

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    // Quand un user fraîchement loggé arrive → on tire ses prefs depuis le serveur.
    if (u) hydrateFromServer({ setMascotState, setLangTrackState });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
  }, []);

  return (
    <UserContext.Provider value={{
      mascot, setMascot,
      userName, setUserName,
      langTrack, setLangTrack,
      user, setUser, logout,
      isLoggedIn: !!user,
      setNodeShape, setPathStyle,
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
