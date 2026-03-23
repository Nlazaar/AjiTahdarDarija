import { useEffect } from 'react'
import { AppState } from 'react-native'
import { flushQueue } from '../lib/offlineQueue'

export function useOfflineQueue() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s)=>{
      if (s === 'active') flushQueue()
    })
    // try flush on mount
    flushQueue()
    return () => { try { sub.remove() } catch {} }
  }, [])
}

export default useOfflineQueue
