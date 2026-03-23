import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useToast } from '../components/ToastContext'

export default function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const router = useRouter()
  const { push } = useToast()

  async function call(path: string, opts: RequestInit = {}, retries = 0) {
    setLoading(true)
    setError(null)
    try {
      const token = await (async () => {
        try { return await (await import('./secureToken')).getToken() } catch { return null }
      })()
      const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers as any) }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const base = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
      const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : '/' + path}`
      const res = await fetch(url, { ...opts, headers })
      if (res.status === 401) {
        push({ type: 'error', message: 'Veuillez vous reconnecter' })
        router.push('/login')
        return null
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || res.statusText)
      }
      const data = await res.json().catch(() => null)
      return data
    } catch (e: any) {
      setError(e)
      push({ type: 'error', message: e.message ?? 'Erreur réseau' })
      if (retries > 0) return call(path, opts, retries - 1)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, call }
}
