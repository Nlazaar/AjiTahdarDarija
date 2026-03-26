"use client"
import { createContext, useContext, useState, useEffect } from "react"

export type MascotId = "lion" | "girl" | "boy" | "bird"

export interface MascotConfig {
  id:   MascotId
  name: string
}

export const MASCOT_IMAGES: Record<MascotId, string> = {
  lion: "/images/maroccan-lion-trans.png",
  girl: "/images/maroccan-girl-trans.png",
  boy:  "/images/maroccan-child-trans.png",
  bird: "/images/mascot-bird.png",   // fallback emoji si absent
}

export const MASCOT_EMOJI: Record<MascotId, string> = {
  lion: "🦁",
  girl: "👧",
  boy:  "👦",
  bird: "🦉",
}

export const MASCOT_MESSAGES: Record<string, Record<MascotId, string>> = {
  parcours:       { lion: "Yallah, on apprend ! 🦁", girl: "SAYE, BSSAHI! 👍",        boy: "Marhaba, on commence ! 🎒", bird: "Hoot ! On y va ! 🦉"        },
  lessonComplete: { lion: "Bravo ! Tu déchires !",   girl: "Mabrook ! C'est parfait !", boy: "Waouh ! Continue comme ça !", bird: "Excellent ! Continue ! 🦉" },
}

interface MascotContextType {
  mascot:     MascotConfig | null
  setMascot:  (config: MascotConfig) => void
  getMessage: (context: string) => string
}

const MascotContext = createContext<MascotContextType | null>(null)

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [mascot, setMascotState] = useState<MascotConfig | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aji_mascot")
      if (saved) setMascotState(JSON.parse(saved))
    } catch {}
  }, [])

  const setMascot = (config: MascotConfig) => {
    setMascotState(config)
    localStorage.setItem("aji_mascot", JSON.stringify(config))
  }

  const getMessage = (ctx: string) =>
    mascot ? (MASCOT_MESSAGES[ctx]?.[mascot.id] ?? "") : ""

  return (
    <MascotContext.Provider value={{ mascot, setMascot, getMessage }}>
      {children}
    </MascotContext.Provider>
  )
}

export const useMascot = () => {
  const ctx = useContext(MascotContext)
  if (!ctx) throw new Error("useMascot must be inside MascotProvider")
  return ctx
}
