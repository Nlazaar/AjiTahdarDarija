import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

const ThemeContext = createContext({ theme: 'auto' as Theme, setTheme: (t: Theme) => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme) || 'auto' : 'auto'))

  useEffect(() => {
    try { localStorage.setItem('theme', theme) } catch {}
    const root = document.documentElement
    if (theme === 'auto') {
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      root.dataset.theme = prefers ? 'dark' : 'light'
    } else {
      root.dataset.theme = theme
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

export default useTheme
