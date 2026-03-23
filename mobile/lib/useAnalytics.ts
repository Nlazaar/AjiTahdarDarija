import { useCallback } from 'react'
import useApi from './useApi'

export function useAnalytics() {
  const { call } = useApi()
  const track = useCallback(async (type: string, payload: any = {}) => {
    try {
      await call('/analytics', { method: 'POST', body: JSON.stringify({ type, payload }) })
    } catch {}
  }, [call])
  return { track }
}

export default useAnalytics
