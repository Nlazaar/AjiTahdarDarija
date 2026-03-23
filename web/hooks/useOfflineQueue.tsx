import { useEffect } from 'react'
import { flushQueue } from '../lib/offlineQueue'

export function useOfflineQueue() {
  useEffect(() => {
    async function tryFlush() {
      if (navigator.onLine) await flushQueue()
    }
    window.addEventListener('online', tryFlush)
    // try on mount
    tryFlush()
    return () => window.removeEventListener('online', tryFlush)
  }, [])
}

export default useOfflineQueue
