import React from 'react'
import { useRouter } from 'expo-router'
import jwtDecode from 'jwt-decode'
import { getToken, logout as authLogout } from './auth'

type JwtPayload = { sub?: string; userId?: string; exp?: number }

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [userId, setUserId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    getToken()
      .then((t) => {
        if (!mounted) return
        if (!t) {
          setUserId(null)
        } else {
          try {
            const p = jwtDecode<JwtPayload>(t)
            setUserId((p.userId as string) ?? (p.sub as string) ?? null)
          } catch (e) {
            setUserId(null)
          }
        }
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const ensureAuth = React.useCallback(() => {
    if (!userId && !loading) router.replace('/login')
  }, [userId, loading, router])

  const logout = React.useCallback(async () => {
    await authLogout()
    setUserId(null)
    router.replace('/login')
  }, [router])

  return { loading, userId, ensureAuth, logout }
}
