import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'darija_settings'

function readThemeFromStorage(): Theme {
  if (typeof window === 'undefined') return 'auto'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    if (parsed.theme === 'light') return 'light'
    if (parsed.theme === 'dark')  return 'dark'
  } catch {}
  return 'auto'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.dataset.theme = prefersDark ? 'dark' : 'light'
  } else {
    root.dataset.theme = theme
  }
}

const ThemeContext = createContext({
  theme: 'auto' as Theme,
  setTheme: (_t: Theme) => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readThemeFromStorage)

  const setTheme = (t: Theme) => {
    setThemeState(t)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const settings = raw ? JSON.parse(raw) : {}
      settings.theme = t === 'auto' ? 'default' : t
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {}
    applyTheme(t)
  }

  useEffect(() => {
    applyTheme(theme)

    // Réagir aux changements du système en mode auto
    if (theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('auto')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export default useTheme
