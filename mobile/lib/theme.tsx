import React from 'react'
import { Appearance } from 'react-native'

type Theme = 'light' | 'dark' | 'auto'

const ThemeContext = React.createContext({ theme: 'auto' as Theme, setTheme: (t: Theme) => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('auto')
  React.useEffect(() => {
    const pref = Appearance.getColorScheme()
    if (theme === 'auto') {
      // nothing to do; platform handles it via Appearance
    }
  }, [theme])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() { return React.useContext(ThemeContext) }

export default useTheme
