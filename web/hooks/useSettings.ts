"use client"

const STORAGE_KEY = 'darija_settings'

interface Settings {
  soundEffects:       boolean
  animations:         boolean
  encouragement:      boolean
  listeningExercises: boolean
  theme:              'default' | 'light' | 'dark'
}

const DEFAULTS: Settings = {
  soundEffects: true, animations: true, encouragement: true,
  listeningExercises: true, theme: 'default',
}

export function getSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch { return DEFAULTS }
}
