import { useEffect } from 'react'
import { getLesson, getExercises } from './api'
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
        const data = await getLesson(nextLessonId)
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
    const data = await getExercises(exId)
    setLocalCache(key, data, 60 * 5)
  } catch {
    // ignore
  }
}
