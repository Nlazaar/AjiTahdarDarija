import React from 'react'
import api from '../lib/api'

type Gamification = {
  xp: number
  level: number
  streak: number
  hearts: number
  badges: Array<{ id: string; name: string; unlocked: boolean; icon?: string }>
}

export default function useGamification() {
  const [data, setData] = React.useState<Gamification | null>(null)
  const loadingRef = React.useRef(false)

  async function refreshGamification() {
    if (loadingRef.current) return
    loadingRef.current = true
    try {
      const res = await api.getGamificationApi()
      setData({
        xp: res.xp ?? 0,
        level: res.level ?? Math.floor((res.xp ?? 0) / 100),
        streak: res.streak ?? 0,
        hearts: res.hearts ?? 0,
        badges: res.badges ?? [],
      })
    } catch (e) {
      // keep previous
    } finally {
      loadingRef.current = false
    }
  }

  React.useEffect(() => {
    refreshGamification()
  }, [])

  return {
    xp: data?.xp ?? 0,
    level: data?.level ?? 0,
    streak: data?.streak ?? 0,
    hearts: data?.hearts ?? 0,
    badges: data?.badges ?? [],
    refreshGamification,
  }
}
