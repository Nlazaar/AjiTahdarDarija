import { useEffect } from 'react'
import api from './api'
import { setLocalCache, getLocalCache } from './localCache'

export function usePrefetchLesson(nextLessonId?: string) {
  useEffect(() => {
    if (!nextLessonId) return
    const key = `lesson:${nextLessonId}`
    const cached = getLocalCache(key)
    if (cached) return
    let mounted = true
    ;(async () => {
      try {
        const data = await api.get(`/lessons/${nextLessonId}`)
        if (!mounted) return
        setLocalCache(key, data, 60 * 5)
      } catch {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [nextLessonId])
}

export async function prefetchExercise(exId: string) {
  const key = `exercise:${exId}`
  try {
    const cached = getLocalCache(key)
    if (cached) return
    const data = await api.get(`/exercises/${exId}`)
    setLocalCache(key, data, 60 * 5)
  } catch {
    // ignore
  }
}
