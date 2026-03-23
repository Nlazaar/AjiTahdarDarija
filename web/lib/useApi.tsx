"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastContext'
import { API_URL } from './constants'

export default function useApi() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<any>(null)
  const router = useRouter()
  const { push } = useToast()

  async function call(path: string, opts: RequestInit = {}, retries = 0) {
    setLoading(true)
    setError(null)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : ''
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? path : '/' + path}`
      const res = await fetch(url, { ...opts, headers })
      if (res.status === 401) {
        // redirect to login
        router.push('/login')
        return null
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText)
      }
      const data = await res.json().catch(() => null)
      return data
    } catch (e: any) {
      setError(e)
      push({ type: 'error', message: e.message ?? 'Request failed' })
      if (retries > 0) {
        return call(path, opts, retries - 1)
      }
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, call }
}
