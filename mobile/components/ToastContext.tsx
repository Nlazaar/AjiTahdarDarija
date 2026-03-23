import React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'

type Toast = { id: string; type: 'info'|'success'|'error'; message: string }

const ToastContext = React.createContext<{ push: (t: Omit<Toast,'id'>) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  function push(t: Omit<Toast,'id'>) {
    const id = String(Date.now())
    setToasts((s) => [...s, { ...t, id }])
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 3500)
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((t) => (
          <View key={t.id} style={[styles.toast, t.type === 'error' ? styles.error : t.type === 'success' ? styles.success : styles.info]}>
            <Text style={styles.text}>{t.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 24, left: 16, right: 16, alignItems: 'center' },
  toast: { padding: 12, borderRadius: 8, marginBottom: 8, minWidth: 200 },
  text: { color: '#fff' },
  success: { backgroundColor: '#10b981' },
  error: { backgroundColor: '#ef4444' },
  info: { backgroundColor: '#111827' },
})
