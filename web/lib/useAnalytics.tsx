import { useCallback } from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export function useAnalytics() {
  const track = useCallback(async (type: string, payload: any = {}) => {
    try {
      await fetch(`${BASE}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      })
    } catch (e) {
      // swallow
    }
  }, [])

  return { track }
}

export default useAnalytics
