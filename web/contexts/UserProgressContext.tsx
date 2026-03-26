"use client"
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { getToken } from "@/lib/auth"
import { addXp, updateStreak, getGamification, updateHearts } from "@/lib/api"

export interface Quete {
  id:      string
  icon:    string
  label:   string
  current: number
  total:   number
}

interface UserProgress {
  xp:               number
  gemmes:           number
  streak:           number
  hearts:           number
  niveau:           string
  level:            number
  quetes:           Quete[]
  completedLessons: string[]
}

interface UserProgressContextType {
  progress:        UserProgress
  addXP:           (amount: number) => void
  addGemmes:       (amount: number) => void
  incrementStreak: () => void
  loseHeart:       () => void
  updateQuete:     (id: string, current: number) => void
  completeLesson:  (lessonId: string) => void
  syncFromBackend: () => Promise<void>
}

const getNiveau = (xp: number) =>
  xp >= 5000 ? "Platine" : xp >= 2000 ? "Or" : xp >= 1000 ? "Argent" : "Bronze"

const defaultProgress: UserProgress = {
  xp: 0, gemmes: 0, streak: 0, hearts: 5, niveau: "Bronze", level: 1,
  completedLessons: [],
  quetes: [
    { id: "lecons",  icon: "🕌", label: "Finir 3 leçons",    current: 0, total: 3   },
    { id: "xp",      icon: "⭐", label: "Gagner 100 XP",      current: 0, total: 100 },
    { id: "streak",  icon: "🔥", label: "Prolonger la série", current: 0, total: 1   },
  ],
}

const UserProgressContext = createContext<UserProgressContextType | null>(null)

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress)
  const synced = useRef(false)

  /* ── Sync depuis le backend au montage (si connecté) ── */
  const syncFromBackend = useCallback(async () => {
    if (!getToken()) return
    try {
      const [profile] = await Promise.allSettled([getGamification()])
      if (profile.status === 'fulfilled' && profile.value?.xp !== undefined) {
        const data = profile.value as any
        setProgress(p => ({
          ...p,
          xp:     data.xp     ?? p.xp,
          streak: data.streak  ?? p.streak,
          hearts: data.hearts  ?? p.hearts,
          gemmes: data.gemmes  ?? p.gemmes,
          level:  data.level   ?? p.level,
          niveau: getNiveau(data.xp ?? p.xp),
        }))
      }
    } catch {
      // backend indispo → on garde l'état local
    }
  }, [])

  useEffect(() => {
    if (!synced.current) {
      synced.current = true
      syncFromBackend()
    }
  }, [syncFromBackend])

  /* ── Actions : mise à jour optimiste + sync background ── */
  const addXP = useCallback((amount: number) => {
    setProgress(p => {
      const newXP = p.xp + amount
      return {
        ...p,
        xp:     newXP,
        niveau: getNiveau(newXP),
        quetes: p.quetes.map(q =>
          q.id === "xp" ? { ...q, current: Math.min(q.current + amount, q.total) } : q
        ),
      }
    })
    // Sync silencieux
    if (getToken()) addXp(amount).catch(() => {})
  }, [])

  const addGemmes = useCallback((amount: number) => {
    setProgress(p => ({ ...p, gemmes: p.gemmes + amount }))
  }, [])

  const incrementStreak = useCallback(() => {
    setProgress(p => ({
      ...p,
      streak: p.streak + 1,
      quetes: p.quetes.map(q =>
        q.id === "streak" ? { ...q, current: Math.min(q.current + 1, q.total) } : q
      ),
    }))
    if (getToken()) updateStreak().catch(() => {})
  }, [])

  const loseHeart = useCallback(() => {
    setProgress(p => ({ ...p, hearts: Math.max(0, p.hearts - 1) }))
    if (getToken()) updateHearts(-1).catch(() => {})
  }, [])

  const updateQuete = useCallback((id: string, current: number) => {
    setProgress(p => ({
      ...p,
      quetes: p.quetes.map(q => q.id === id ? { ...q, current: Math.min(q.current + current, q.total) } : q),
    }))
  }, [])

  const completeLesson = useCallback((lessonId: string) => {
    setProgress(p => ({
      ...p,
      completedLessons: p.completedLessons.includes(lessonId)
        ? p.completedLessons
        : [...p.completedLessons, lessonId],
      quetes: p.quetes.map(q =>
        q.id === "lecons" ? { ...q, current: Math.min(q.current + 1, q.total) } : q
      ),
    }))
  }, [])

  return (
    <UserProgressContext.Provider value={{
      progress, addXP, addGemmes, incrementStreak, loseHeart,
      updateQuete, completeLesson, syncFromBackend,
    }}>
      {children}
    </UserProgressContext.Provider>
  )
}

export const useUserProgress = () => {
  const ctx = useContext(UserProgressContext)
  if (!ctx) throw new Error("useUserProgress must be inside UserProgressProvider")
  return ctx
}
